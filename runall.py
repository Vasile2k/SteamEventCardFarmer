
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at

#   http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

# Made by Vasile2k. See LICENSE

import json
from subprocess import Popen

accounts = json.loads(open("accounts.json").read())

for account in accounts:
	command = "phantomjs cardFarmer.js " + account["steamid64"] + " " + account["username"] + " " + account["password"]
	print("Calling for " + account["username"])
	Popen(command.split(" "))
	print("Called for  " + account["username"])