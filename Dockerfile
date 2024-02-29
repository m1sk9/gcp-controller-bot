FROM oven/bun:1.0.29-slim as Build

SHELL [ "/bin/bash", "-c" ]
WORKDIR /app

COPY . .

RUN bun install --production \
    && bun run build

WORKDIR /build
RUN cp -r /app/{package.json,bun.lockb} . \
    && cp -r /app/public . \
    && cp -r /app/build/ .

FROM ubuntu:jammy-20240212 as Runner

COPY --from=build /usr/local/bin/ /usr/local/bin/
COPY --from=Build /build .

LABEL org.opencontainers.image.source=https://github.com/m1sk9/gcp-controller-bot

ENTRYPOINT [ "bun" ]
CMD [ "run", "build/index.js" ]
