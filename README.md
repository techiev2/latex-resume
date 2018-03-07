# Latex Resume

A cleaned up LaTeX based resume generation repository for personal use. Provides a simple sample resume template and a XeLaTeX based build shell script. The template is built by abstracting sections into smaller components with the use of custom TeX commands.

Caveat emptor #1: The build script assumes the presence of xelatex in the system environment. On Ubuntu, use ```sudo apt-get install -y texlive-xetex / texlive/full``` to install xelatex. For an editor, Texmaker is a good choice and can be installed with ```sudo apt-get install -y texmaker```

Caveat emptor #2: As the sample template indicates, all sizes/fonts used herewith are based on certain environmental conditions. Feel free to update them according to your requirements.

Caveat emptor #3: The build script is a naive bash wrapper over xelatex and does not handle cases where the xelatex shell is held up due to environmental/code level failures. This would be fixed soon.

Font: Gentium Book Basic is the base font being used with the template. This comes installed with Open Office (on Ubuntu at the least). If the build script stalls due to caveat #3, please run xelatex from your shell to ascertain the error and create an issue in the repo for a fix.
