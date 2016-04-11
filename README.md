#Webconfig
##Overview
* usb0: setup by udhcpd
* wlan0: setup by ConnMan
* SoftAp0: setup by dnsmasq

###wlan0
Setup by ConnMan, because of wifi captive portal need dns server, so we disable ConnMan dns serivce.
>cat /lib/systemd/system/connman.service 

	[Unit]
	Description=Connection service
	DefaultDependencies=false
	Conflicts=shutdown.target
	RequiresMountsFor=/var/lib/connman
	After=dbus.service network-pre.target systemd-sysusers.service
	Before=network.target multi-user.target shutdown.target
	Wants=network.target

	[Service]
	Type=dbus
	BusName=net.connman
	Restart=on-failure
	ExecStart=/usr/sbin/connmand -n --nodnsproxy
	StandardOutput=null
	CapabilityBoundingSet=CAP_KILL CAP_NET_ADMIN CAP_NET_BIND_SERVICE CAP_NET_RAW CAP_SYS_TIME CAP_SYS_MODULE
	ProtectHome=true
	ProtectSystem=full

	[Install]
	WantedBy=multi-user.target
###SoftAp0
In order to set Wifi to Multrole mode, so add SoftAp0  virtual interface.
>cat /usr/bin/wifidog_pre

	#!/bin/bash
	iw phy phy0 interface add SoftAp0 type managed
	ifconfig SoftAp0 up
	ifconfig SoftAp0 192.168.8.1 netmask 255.255.255.0 up
	echo 1 > /proc/sys/net/ipv4/ip_forward
	iptables -t nat -A POSTROUTING -o wlan0 -j MASQUERADE
	iptables -A FORWARD -i wlan0 -o SoftAp0 -m state --state RELATED,ESTABLISHED -j ACCEPT
	iptables -A FORWARD -i SoftAp0 -o wlan0 -j ACCEPT

	wifidog -f -d 7

Start this script on boot.
>cat /lib/systemd/system/wifidog-gateway.service

	[Unit]
	Description=wifidog gateway Service
	After=network.target

	[Service]
	Type=simple
	ExecStart=/usr/bin/wifidog_pre
	KillSignal=SIGINT
	Restart=on-failure
	RestartSec=5

	[Install]
	WantedBy=multi-user.target
SoftAp0 dhcpd services provided by dnsmasq. wifi captive portal also need dnsmasq provide dns local analysis.
>cat /etc/dnsmasq.d/SoftAp0

	interface=SoftAp0
	port=53
	dhcp-authoritative
	domain-needed
	bogus-priv
	expand-hosts
	cache-size=2048
	#domain=lan
	#server=/lan/
	#dhcp-range=lan,192.168.8.50,192.168.8.150,12h
	dhcp-range=192.168.8.50,192.168.8.150,12h
	listen-address=127.0.0.1
	listen-address=192.168.8.1
	#server=/beaglebone.lan/
	#server=/captive.apple.com/
	#server=/beaglebone.local/
	dhcp-option-force=option:router,192.168.8.1
	dhcp-option-force=option:dns-server,192.168.8.1
	dhcp-option-force=option:mtu,1500
	#no-hosts 
	#bind-interfaces
	#no-resolv
	#address=/beaglebone.lan/192.168.8.1
	#address=/beaglebone.local/192.168.8.1
	address=/#/172.1.8.1
	#ptr-record=1.8.168.192.in-addr.arpa,beaglebone.lan
SoftAp0 AP mode seted by hostapd(hostapd v2.5-devel), We update it from https://git.ti.com/wilink8-wlan/build-utilites.git. Configure hostapd example:
https://github.com/Pillar1989/wifidog-server/blob/BBGW/conf/hostapd.conf

Actually it config in nodejs code.
https://github.com/Pillar1989/wifidog-server/blob/BBGW/config.js

###Wifi captive portal
We use wifidog(www.wifidog.org) provide wifi captive portal.
>git clone https://github.com/Pillar1989/wifidog-gateway
>./autogen.sh
>configure --prefix=/usr
>make && make install

Config it:
>cp wifidog.* /usr/etc/

	...
	GatewayInterface SoftAp0
	...
	GatewayAddress 192.168.8.1
	...
	AuthServer { 
	Hostname 192.168.8.1
	SSLAvailable no
	HTTPPort 520
	Path /
	}
	...

###Wifidog Protocol

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
###wifidog server
>git clone https://github.com/Pillar1989/wifidog-server -B BBGW
>cd wifidog-server
>npm install
>npm start

Enjoy it.

## License

This project is developed by Baozhu Zuo(<zuobaozhu@gmail>) for seeed studio. 

The code written in this project is licensed under the [GNU GPL v3 License](http://www.gnu.org/licenses/gpl-3.0.en.html). 

