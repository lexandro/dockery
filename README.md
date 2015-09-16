# FYI

Dockery is available as hosted webapp from now: **[http://dockery.io/dockery](http://dockery.io/dockery)** No any local installation or hosting needed, just bookmark it in your browser

# dockery

Dockery is a lightweight [docker] (http://docker.io) management and monitoring application for **developers**. If you are new with container technologies and lxc based containerization, use Dockery 
for easier management and more productivity. Dockery is available as 

- **[Chrome application](https://chrome.google.com/webstore/detail/dockery-light/cefhojablgaokgccloekpocgmffgecmm)**
- **[Docker image](https://hub.docker.com/r/lexandro/dockery/)**
- **[Github hosted webapp](http://dockery.io/dockery/)**

<a target="_blank" href="https://chrome.google.com/webstore/detail/dockery-light/cefhojablgaokgccloekpocgmffgecmm">
<img alt="Try it now" src="https://raw.github.com/GoogleChrome/chrome-app-samples/master/tryitnowbutton_small.png" title="Click here to install this app from the Chrome Web Store"></img>
</a>
 
### Table of Contents
**[Enable remote access to a Docker daemon](#enable-remote-access-to-a-docker-daemon)**  
**[Run as docker container](#run-as-docker-container)**  
**[Beta screenshots](#beta-screenshots)**  
**[Development roadmap](#development-roadmap)**  
**[Release notes](#release-notes)**
 

## Enable remote access to a Docker daemon

## Changes from Remote API version 1.18

In the V1.18 of Remote API, docker introduced a new version of cors configuration. The [documentation] (https://docs.docker.com/v1.6/reference/api/docker_remote_api_v1.18/#33-cors-requests) describes how could you setup the origin for the daemon.

If you use Dockery as hosted app you should configure **http://dockery.io** as origin.



## Pre v1.18 config:

To manage your docker host(s) with **dockery** please please add the following parameters to your Docker daemon launcher:

```bash
 $ docker -d -H=0.0.0.0:2375 -api-enable-cors
```

or edit your **/etc/default/docker** file:

```bash
DOCKER_OPTS='-H tcp://0.0.0.0:2375 -api-enable-cors'
```

A more recommended approach:
```bash
DOCKER_OPTS="--dns 8.8.8.8 --dns 8.8.4.4 -H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock -api-enable-cors"

```

This command makes docker daemon accessible on port 2375, you just need to add to Dockery as http://**server ip**:2375.

then issue the following command to activate changes:
```bash
service docker restart
```
## Run as docker container
dockery is released as an nginx backed docker image to make it easier to use. The image is auto updated by every push with the **latest** tag, the versioning will be added 
after the first official releaseing

**get the image**
```bash
docker pull lexandro/dockery
```

**start the image**
```bash
docker run -d -p 80:80 --name dockery lexandro/dockery
```

Then you can access docker at http://<docker host>:80.

## Beta screenshots
These screenshots are not representing the final version!

### List of docker hosts
![hosts](docs/images/screenshot_hosts.jpg "List of hosts")

### Host details
![host details](docs/images/screenshot_host_details.jpg "Details of the selected host")

### List of docker host containers
![containers](docs/images/screenshot_containers.jpg "List of docker host containers")

### Docker container details
![container details](docs/images/screenshot_container_details.jpg "Docker container details")

### List of docker host images
![images](docs/images/screenshot_images.jpg "List of docker host images")

### Docker image details
![image details](docs/images/screenshot_image_details.jpg "Docker image details")

# Development roadmap
Here's the list of active, scheduled, planned and finished development goals

## Under development

## Under development
0.3.1
- Add: push image to the repository
- Add: helper links to the known fields/information pieces to help understand
- Add: In Chrome mode add Settings view to enable synced storage usage, etc..
- Add: cloud based settings persistence
- Add: Online stat for the hosted app. Sorry.
- Add: pure JSON view for image details
- Add: remove button to imageDetails
- Fix: redesign image deletion/tag deletion
- Fix: container creation has no real random generator and image tag list
- Fix: create container not running with locally not available images

## Roadmap /by priority/
0.3.2
- Add: exit code filter to container list view 
- Add: status filter to container list view
- Add   : shareable URLs in the address line.
- Add: ordering in search result by fields
- Review: Docker Host info

0.3.3
 - Add: search/pull image from private repo(s) 

0.4.0
- Fix: redesign host information page...drastically++ :)

0.4.1
- Add: download file link to containers/container details/diff listing items

0.4.2
- Add: Events view to receive docker activities (with max size)
- Add: also add tooltips to these items on all views

0.5.0
- Fix: make it more responsive

0.5.1

- Add: option to show containers logs as formatted/raw 
- Fix: TTY terminal doubling characters in some cases.  

0.5.2 
- Add: set refresh interval on container listing
- Fix: Adding new host sometimes causing index by errors.

0.6
- Add: show containerdetails/ cpu/network datastream as diagram/graph or stg. else 

0.6.1
- Add: paging of containers
- Add: select all/select page on containers

0.6.2
- Add: paging of images
- Add: select all/select page on images

0.6.3
- Add: export/import hosts list


## Not scheduled yet
- Add: TTL based authentication for docker daemon ports
- Add: download logs as file.
- Add: back button/listener to screens in chrome mode
- Help
- docker image with version check in the webapp
- Fix: stopping multiple containers is not working properly on huge list with already stopped containers

## Possible future development ideas
I collected some undecided features [on this page!](https://github.com/lexandro/dockery/wiki/Development-ideas)

# Release notes
You could find the release notes on [this wiki page!](https://github.com/lexandro/dockery/wiki)

## Stack
* [Angular.js](https://github.com/angular/angular.js)
* [Bootstrap](http://getbootstrap.com/)
* [AngularUI for Bootstrap](https://angular-ui.github.io/)
* [Angular-Bootstrap switch](https://github.com/frapontillo/angular-bootstrap-switch)
* [JSON formatter](https://github.com/mohsen1/json-formatter)
* [xterm.js](http://xtermjs.readthedocs.org/en/latest/)
* [toastr.js](https://github.com/CodeSeven/toastr)
* [oboe.js](http://oboejs.com/)
* [Font awesome](https://fortawesome.github.io/Font-Awesome/)
