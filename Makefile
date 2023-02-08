NPM_RUN_WS:=npm run --workspace

PKG_DAMEGA:=@nosense/damega
PKG_WEB_OBNIZ:=@nosense/web-obniz
PKG_WEB:=web

# build
.PHONY: build
build: build/web

.PHONY: build/damega
build/damega: build/web-obniz
	$(NPM_RUN_WS) $(PKG_DAMEGA) build

.PHONY: build/web-obniz
build/web-obniz:
	$(NPM_RUN_WS) $(PKG_WEB_OBNIZ) build

.PHONY: build/web
build/web: build/damega
	$(NPM_RUN_WS) $(PKG_WEB) build


# lint
.PHONY: lint
lint: lint/damega lint/web

.PHONY: lint/damega
lint/damega:
	$(NPM_RUN_WS) $(PKG_DAMEGA) lint

.PHONY: lint/web
lint/web:
	$(NPM_RUN_WS) $(PKG_WEB) lint


# lint-fix
.PHONY: lint-fix
lint-fix: lint-fix/damega lint-fix/web

.PHONY: lint-fix/damega
lint-fix/damega:
	$(NPM_RUN_WS) $(PKG_DAMEGA) lint-fix

.PHONY: lint-fix/web
lint-fix/web:
	$(NPM_RUN_WS) $(PKG_WEB) lint-fix


# test
.PHONY: test
test: test/damega test/web

.PHONY: test/damega
test/damega:
	$(NPM_RUN_WS) $(PKG_DAMEGA) test

.PHONY: test/web
test/web:
	$(NPM_RUN_WS) $(PKG_WEB) test
