#Webconfig
##wifidog Protocol

![](https://github.com/Pillar1989/wifidog-server/blob/BBGW/public/image/wifidog-Protocol.png)

* The client does his initial request, as if he was already connected, (e.g.: http://www.google.ca)
* The Gateway's firewall rules mangle the request to redirect it to a local port on the Gateway. When that's the done, the Gateway provides an HTTP Redirect reply that contains the Gateway ID, Gateway FQDN and other informations
* The Client does his request to the Auth Server as specified by the Gateway, see Login Protocol
* The Gateway replies with a (potentially custom) splash (login) page
* The Client provides his identification informations (username and password)
* Upon succesful authentication, the client gets an HTTP Redirect to the Gateway's own web server with his authentication proof (a one-time token), http://GatewayIP:GatewayPort/wifidog/auth?token=[auth token]
* The Client then connects to the Gateway and thus gives it his token
* The Gateway requests validation of the token from the Auth Server, see Client Protocol
* The Auth Server confirms the token
* The Gateway then sends a redirect to the Client to obtain the Success Page from the Auth Server, redirects to http://auth_server/portal/
* The Auth Server notifies the Client that his request was successful

## License

This project is developed by Baozhu Zuo(<zuobaozhu@gmail>) for seeed studio. 

The code written in this project is licensed under the [GNU GPL v3 License](http://www.gnu.org/licenses/gpl-3.0.en.html). 
