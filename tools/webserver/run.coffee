# ************************************************
# Build HTTP and HTTP_PROXY servers
#
#  Note: to debug Node.js scripts,
#        see https://github.com/dannycoates/node-inspector
#
# Copyright 2012     Mindspace, LLC.
# ************************************************

		# Include the HTTP and HTTP Proxy classes
		# @see http://nodejs.org/docs/v0.4.2/api/modules.html
		# Routes all `matching` calls from local_port to remote_port. Only urls matching the
		#
		ext = require('httpServers' )
		fs  = require( 'fs' )


		# Main application
		#
		main = (options) ->

			options ||= {

					'proxy_enabled': false
					'proxy_regexp' : /^\/app\/api/

					'local_port'   : 8000
					'local_host'   : '127.0.0.1'

					'remote_port'  : 8080
					'remote_host'  : '166.78.24.115'

					# Only used to explicity define the local, hidden web server port
					#'silent_port'  : 8000

				}

			# Primary server, proxies specific GETs to remote web
			# server or to local web server
			new ext.HttpProxyServer() .start( options )

			return

		# Auto-start
		#
		main()