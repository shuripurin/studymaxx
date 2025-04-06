#!/bin/bash

export FLASK_DEBUG=1
export FLASK_ENV=development

flask --app dev run --port=5001
