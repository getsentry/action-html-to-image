action-html-to-image
====================

converts html to images for use in visual snapshot tests

### running the docker image locally

the docker image expects some things from github, you can simulate this:

1. make an `html` folder
1. make a `t.css` file inside of that (can be empty)
1. make some `*.html` files inside the `html` folder

```bash
docker build -t action-html-to-image .
docker run \
     -ti \
    --rm \
    -v "$PWD/html/:/html:rw" \
    -e GITHUB_WORKSPACE=/html \
    -e INPUT_BASE-PATH=/html \
    -e INPUT_CSS-PATH=t.css \
    -e DEBUG="puppeteer:*" \
    action-html-to-image
```

### testing the image from a PR

each PR will build and publish a docker image.  you can try this image in a PR
by applying a diff like this (use your sha instead!):

```diff
       - name: Create Images from HTML
-        uses: getsentry/action-html-to-image@main
+        uses: docker://ghcr.io/getsentry/action-html-to-image:0de1c39c28d4d8f8f42c49761313237840958927
         with:
           base-path: .artifacts/visual-snapshots/jest
```
