'use strict';
const { readFile, writeFile, promises: fsPromises } = require('fs');

const { exec } = require('child_process');
const { createHash } = require('crypto');

const { Server } = require('@techiev2/node_http_server');
const { serialize } = require('@techiev2/node_http_server/middlewares');
const { PORT, ROOT, TEMPLATES_ROOT, JS_ROOT, CSS_ROOT } = require('./config');

const OUT_DIR = '/tmp';

Server.create({
  '/': RootViewController,
  '/api/generate': GenerateController,
})
.addMiddleware(serialize)
.addStaticRoot(JS_ROOT)
.addStaticRoot(CSS_ROOT)
.addStaticRoot(OUT_DIR)
.setResponseType('html')
.start(PORT);


function getContents(path, asBase64) {
  return new Promise((resolve, reject) => {
    readFile(path, (err, content) => {
      if (err) return reject(`Error loading ${path}`);
      if (asBase64) return resolve(content.toString('base64'));
      resolve(content.toString());
    });
  });
}

function writeContents(path, data) {
  return new Promise((resolve, reject) => {
    writeFile(path, data, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

async function RootViewController(req, res) {
  let template = await getContents(`${ROOT}/sample.tex`);
  template = template || '';
  res.renderTemplate(`${TEMPLATES_ROOT}/index.html`, { template });
}

async function GenerateController(req, res) {
  let { content } = req.data || {};
  if (!content) return res.respond(400, 'No content provided');
  let { Referer } = req.headers;
  let id = createHash('md5')
    .update(`${Referer}_${new Date().getTime()}`)
    .digest('hex');
  let fileName = `/tmp/${id}.tex`;
  try {
    let fileRes = await writeContents(fileName, content);
    let cmd = `xelatex -output-directory="${OUT_DIR}" ${fileName}`;
    exec(cmd, async (err, stdout, stderr) => {
      if (err) return res.respond(500, 'Error creating PDF');
      await fsPromises.unlink(`${fileName}`);
      let outFileName = `/tmp/${id}.pdf`;
      let response = await getContents(outFileName, true);
      response = `data:application/pdf;base64,${response}`;

      await fsPromises.unlink(`/tmp/${id}.aux`);
      await fsPromises.unlink(`/tmp/${id}.out`);
      await fsPromises.unlink(`/tmp/${id}.log`);
      // Will hold back once a user system is in place.
      await fsPromises.unlink(`/tmp/${id}.pdf`);

      return res.respond(200, { response });
    });
  } catch (error) {
    return res.respond(500, 'Server error generating PDF');
  }
}