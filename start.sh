#!/usr/bin/env bash
docker compose -f compose.yaml -f compose.$1.yaml ${@:2} up