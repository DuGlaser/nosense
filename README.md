# Nosense

疑似言語を記述し実行するためのエディタ。

![image](https://user-images.githubusercontent.com/50506482/216809635-ac18c336-c7c3-477a-94f8-b35e6c7e6346.png)

## Setup

```bash
$ npm install
```

## Build

```bash
$ make build
```

## Project layout

```
├─ app/             Electron周りの設定
├─ packages/
│  ├─ damega/       疑似言語用のインタプリタ   
│  └─ web-obniz/    Obnizをブラウザ向けにビルドするための設定
└─ web/             Nosenseの本体
```
