FROM node:12.22.12-bullseye-slim

RUN : \
    && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        # needed for chromium to not hang for some reason
        libgl1 \
        # install chromium dependencies only -- puppeteer bundles its own chromium
        # apt install chromium
        # ldd node_modules/puppeteer/.local-chromium/linux-884014/chrome-linux/chrome | awk '{print $3}' | xargs dpkg -S | cut -d: -f1 | sort -u
        libasound2 \
        libatk-bridge2.0-0 \
        libatk1.0-0 \
        libatspi2.0-0 \
        libavahi-client3 \
        libavahi-common3 \
        libblkid1 \
        libbrotli1 \
        libbsd0 \
        libc6 \
        libcairo2 \
        libcom-err2 \
        libcups2 \
        libdatrie1 \
        libdbus-1-3 \
        libdrm2 \
        libexpat1 \
        libffi7 \
        libfontconfig1 \
        libfreetype6 \
        libfribidi0 \
        libgbm1 \
        libgcc-s1 \
        libgcrypt20 \
        libglib2.0-0 \
        libgmp10 \
        libgnutls30 \
        libgpg-error0 \
        libgraphite2-3 \
        libgssapi-krb5-2 \
        libharfbuzz0b \
        libhogweed6 \
        libidn2-0 \
        libk5crypto3 \
        libkeyutils1 \
        libkrb5-3 \
        libkrb5support0 \
        liblz4-1 \
        liblzma5 \
        libmd0 \
        libmount1 \
        libnettle8 \
        libnspr4 \
        libnss3 \
        libp11-kit0 \
        libpango-1.0-0 \
        libpcre2-8-0 \
        libpcre3 \
        libpixman-1-0 \
        libpng16-16 \
        libselinux1 \
        libsystemd0 \
        libtasn1-6 \
        libthai0 \
        libunistring2 \
        libuuid1 \
        libwayland-server0 \
        libx11-6 \
        libxau6 \
        libxcb-render0 \
        libxcb-shm0 \
        libxcb1 \
        libxcomposite1 \
        libxdamage1 \
        libxdmcp6 \
        libxext6 \
        libxfixes3 \
        libxkbcommon0 \
        libxrandr2 \
        libxrender1 \
        libxshmfence1 \
        libzstd1 \
        zlib1g \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN : \
    && yarn install --production \
    && yarn build \
    && yarn cache clean

ENTRYPOINT ["node", "/lib/main.js"]
