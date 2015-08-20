.PHONY: all
all:
	-mkdir fonts
	git show master:.gitignore              > .gitignore
	git show master:CNAME                   > CNAME
	git show master:_config.yml             > _config.yml
	git show master:fonts/ikamodoki1_0.ttf  > fonts/ikamodoki1_0.ttf
	git show master:fonts/ikamodoki1_0.woff > fonts/ikamodoki1_0.woff
	git show master:index.html              > index.html
	git show master:index.js                > index.js
	git show master:index.scss              > index.scss
	git show master:ogp.png                 > ogp.png
