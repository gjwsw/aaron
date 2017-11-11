[![travis](https://img.shields.io/travis/gjwsw/aaron.svg?style=flat-square)](https://travis-ci.org/gjwsw/aaron)

*THIS PROJECT IS DISCONTINUED!* It is in no stable state, not useable, nothing! If you really want to use it, give it a shot. But don't expect anything of it.

# aaron

*aaron* is a fully-integrated web-based church management system.
It's founded on the observation that things are done twice due to
lacks of information, communication or integration.

Tools like [OneBody](http://church.io), [Rock](http://rockrms.com)
or [ChurchTools](http://churchtools.de) offer great solutions to
parts of the problem. *aaron* fits well into integration use cases like

- Manage church members with aaron and add them via CardDav to your
  Smartphone as well as feed their birthdays to sunday service slides
  as well as export a good old printed member registry.
- Manage a calendar with aaron and have rooms automatically blocked
  for the calendar entries (as well as CalDav support + print export).

## Getting Started

### Using aaron

To use aaron, install it globally and run it from anywhere:

```bash
npm i -g aaron # install
aaron          # run
```

In a production environment, you may want to have a web server
(nginx, apache, ...) in front of the actual aaron server that
reverse-proxies all requests (that way, aaron won't block port 80).
See [going productive](#going-productive) on details.

### Contributing to aaron

You want to contribute? Great! You can do that in various ways:

- *Pray!*
- *Spread the word!*
- *Report issues!*
- *Help develop!*

## License

