NPM_RUN_WS:=npm run --workspace

PKG_DAMEGA:=@nosense/damega
PKG_WEB:=web
PKG_APP:=app

.PHONY: build/damega
build/damega:
	$(NPM_RUN_WS) $(PKG_DAMEGA) build

.PHONY: build/web
build/web: build/damega
	$(NPM_RUN_WS) $(PKG_WEB) build

.PHONY: build/app
build/app: build/web
	$(NPM_RUN_WS) $(PKG_APP) build

.PHONY: lint
lint:
	$(MAKE) lint/damega
	$(MAKE) lint/web
	$(MAKE) lint/app

.PHONY: lint/damega
lint/damega:
	$(NPM_RUN_WS) $(PKG_DAMEGA) lint

.PHONY: lint/web
lint/web:
	$(NPM_RUN_WS) $(PKG_WEB) lint

.PHONY: lint/app
lint/app:
	$(NPM_RUN_WS) $(PKG_APP) lint


.PHONY: lint-fix
lint-fix:
	$(MAKE) lint-fix/damega
	$(MAKE) lint-fix/web
	$(MAKE) lint-fix/app

.PHONY: lint-fix/damega
lint-fix/damega:
	$(NPM_RUN_WS) $(PKG_DAMEGA) lint-fix

.PHONY: lint-fix/web
lint-fix/web:
	$(NPM_RUN_WS) $(PKG_WEB) lint-fix

.PHONY: lint-fix/app
lint-fix/app:
	$(NPM_RUN_WS) $(PKG_APP) lint-fix
