#!/bin/env sh

# File: env-info.sh
# Authors: Pavle Batuta <pavle@disberse.com>
# Description:  Display relevant environment config:

## Variables:

# Set the script and project source directories:
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_DIR="$(dirname SCRIPT_DIR)"

## Script:

[ -f "${PROJECT_DIR}/.env" ] && {
    source "${PROJECT_DIR}/.env"  # Source the env file.
}

echo -e "Environment:"
echo -e "|"
echo -e "|-- MNEMONIC=${MNEMONIC}"
echo -e "|"
echo -e "|- Compiler:"
echo -e "|"
echo -e "|-- COMPILER_SOLC_VERSION=${COMPILER_SOLC_VERSION}"
echo -e "|-- COMPILER_SOLC_SETTINGS_OPTIMIZER_ENABLED=${COMPILER_SOLC_SETTINGS_OPTIMIZER_ENABLED}"
echo -e "|-- COMPILER_SOLC_SETTINGS_OPTIMIZER_RUNS=${COMPILER_SOLC_SETTINGS_OPTIMIZER_RUNS}"
echo -e "|-- COMPILER_SOLC_SETTINGS_EVMVERSION=${COMPILER_SOLC_SETTINGS_EVMVERSION}"
echo -e "|"
echo -e "|- Docker:"
echo -e "|"
echo -e "|-- DOCKER_GANACHE_ADDRESS_CNT=${DOCKER_GANACHE_ADDRESS_CNT}"
echo -e "|"
echo -e "|- Mocha:"
echo -e "|"
echo -e "|-- MOCHA_BAIL_ENABLED=${MOCHA_BAIL_ENABLED}"
echo -e "|-- MOCHA_TIMEOUTS_ENABLED=${MOCHA_TIMEOUTS_ENABLED}"
echo -e "|-- MOCHA_REPORTER=${MOCHA_REPORTER}"
echo -e "|"
echo -e "|- Networks:"
echo -e "|"
echo -e "|-- Development:"
echo -e "|"
echo -e "|--- NETWORKS_DEVELOPMENT_NETWORK_ID=${NETWORKS_DEVELOPMENT_NETWORK_ID}"
echo -e "|--- NETWORKS_DEVELOPMENT_HOST=${NETWORKS_DEVELOPMENT_HOST}"
echo -e "|--- NETWORKS_DEVELOPMENT_PORT=${NETWORKS_DEVELOPMENT_PORT}"
echo -e "|--- NETWORKS_DEVELOPMENT_GAS_LIMIT=${NETWORKS_DEVELOPMENT_GAS_LIMIT}"
echo -e "|--- NETWORKS_DEVELOPMENT_GAS_PRICE=${NETWORKS_DEVELOPMENT_GAS_PRICE}"
echo -e "|--- NETWORKS_DEVELOPMENT_START_ETH=${NETWORKS_DEVELOPMENT_START_ETH}"
echo -e "|"
echo -e "|-- Docker:"
echo -e "|"
echo -e "|--- NETWORKS_DOCKER_NETWORK_ID=${NETWORKS_DOCKER_NETWORK_ID}"
echo -e "|--- NETWORKS_DOCKER_HOST=${NETWORKS_DOCKER_HOST}"
echo -e "|--- NETWORKS_DOCKER_PORT=${NETWORKS_DOCKER_PORT}"
echo -e "|--- NETWORKS_DOCKER_GAS_LIMIT=${NETWORKS_DOCKER_GAS_LIMIT}"
echo -e "|--- NETWORKS_DOCKER_GAS_PRICE=${NETWORKS_DOCKER_GAS_PRICE}"
echo -e "|--- NETWORKS_DOCKER_START_ETH=${NETWORKS_DOCKER_START_ETH}"
