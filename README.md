# doxyjs

A simple CLI tool for converting Javascript into psudo C++ for [Doxygen](http://www.stack.nl/~dimitri/doxygen/), inspired by [doxyqml](https://github.com/agateau/doxyqml).

## Installation

Install it once globally via [`npm`](https://www.npmjs.com/package/doxyjs):

```sh
npm install -g doxyjs
```

Or via [`yarn`](https://yarnpkg.com/en/package/doxyjs):

```sh
yarn global add doxyjs
```

**You’ll need to have Node >= 7 on your machine**. You can use [nvm](https://github.com/creationix/nvm#usage) or [ndenv](https://github.com/riywo/ndenv) to easily switch Node versions between different projects.

## Usage

### CLI

You can use `doxyjs` as standalone CLI tool to generate pseudo C++ code from javascript source files.

#### Example

Printing pseudo C++ representation of Javascript source to standard output:

```sh
doxyqml --encoding utf8 --line-break lf file.js other_file.js
```

#### Options

```sh
$ doxyjs --help

  Usage: doxyjs [options] [files...]

  Converts Javascript into psudo C++ for Doxygen processing

  Options:

    -h, --help                     output usage information
    -V, --version                  output the version number
    -e, --encoding <encoding>      source files encoding (utf8 by default)
    -b, --line-break <line break>  line break symbol [lf|crlf] (lf by default)

```

### Doxygen Integration

To use `doxyjs` with Doxygen you must make few changes to your Doxyfile.

*   Add the `.js` extension to the `FILTER_PATTERNS`:

    ```
    FILTER_PATTERNS = *.js=doxyjs
    ```
*   Add the `.js` extension to `FILE_PATTERNS`:

    ```
    FILE_PATTERNS = *.js
    ```
*   Since Doxygen 1.8.8, you must also add the `.js` extension to `EXTENSION_MAPPING`:

    ```
    EXTENSION_MAPPING = js=C++
    ```

## Documenting code

### Variables

`doxyjs` will use `var` as default variable's type, but you can override it with `type:<YourTypeHere>`.

```javascript
//! type:String This is variable
var a = 'some string value';
```

Code above will transform into:

```c++
//! This is variable
String a;
```

However, you can omit any type definitions. Then default type `var` will be used.

### Functions

Type definition for function arguments done the same way as for variables. Also you're able define functions's return type, however, this is still optional.

```javascript
/*!
 *  @brief Test Function
 *  @param type:Object param1 first parameter
 *  @param type:String param2 second parameter
 *  @return type:Date return value description
 */
function global_function_with_args(param1, param2) {
  return new Date();
}
```

Resulting pseudo C++:

```c++
/*!
 * @brief Test Function
 * @param param1 first parameter
 * @param param2 second parameter
 * @return return value description
 */
Date global_function_with_args(Object param1, String param2);
```

For functions without return value, just omit `@return` comment section:

```javascript
/*!
 *  @brief Test Function
 */
function global_function_without_arg() {
}
```

```c++
/*!
 * @brief Test Function
 */
void global_function_without_arg();
```

### Classes

Next contructions will be interpreted as classes:

```javascript

/*!
 * @brief Argument Class
 * @param type:Object arg argument description
 */
function Argument(arg) {
    if (!(this instanceof Argument)) {
        return new Argument(arg);
    }
}

/*!
 * @brief Get child arguments
 * @param type:String name arguments name
 * @return type:Array child arguments
 */
Argument.prototype.getArguments = function(name) {
}

/*!
 * @brief Get first child argument
 * @param type:String name argument name
 * @return type:Argument child argument
 */
Argument.prototype.getArgument = function(name) {
}

/*!
 * @brief Add child arguments
 * @param type:Argument arg argument
 */
Argument.prototype.addArgument = function(arg) {
}

/*!
 * @brief Command Class
 * @param type:Object cmd command description
 */
function Command(cmd) {
    if (!(this instanceof Command)) {
        return new Command(cmd);
    }

    var _cmd = (cmd || {});

    Argument.call(this, _cmd);
}

Command.prototype = Object.create(Argument.prototype);
Command.prototype.constructor = Argument;

/*!
 * @brief Event Class
 * @param type:Object event event description
 */
function Event(event) {
    if (!(this instanceof Event)) {
        return new Event(event);
    }

    var _event = (event || {});

    Argument.call(this, _event);
}

Event.prototype = Object.create(Argument.prototype);
Event.prototype.constructor = Argument;
```

Output pseudo code:

```c++
//! Argument Class
class Argument {
public:
    /*!
     * @brief Constructor
     * @param arg argument description
     */
    Argument(Object arg);

    /*!
     * @brief Get child arguments
     * @param name arguments name
     * @return child arguments
     */
    Array getArguments(String name);

    /*!
     * @brief Get first child argument
     * @param name argument name
     * @return child argument
     */
    Argument getArgument(String name);

    /*!
     * @brief Add child arguments
     * @param arg argument
     */
    void addArgument(Argument arg);
};

//! Command Class
class Command: public Argument {
public:
    /*!
     * @brief Constructor
     * @param cmd command description
     */
    Command(Object cmd);
};

//! Event Class
class Event: public Argument {
public:
    /*!
     * @brief Constructor
     * @param event event description
     */
    Event(Object event);
};

```

Here some things to notice:

*   Base class is determined by next code:

    ```javascript
    Event.prototype.constructor = Argument;
    ```

    Here `Argument` will be used as base class of `Event`.

*   Classes brief description and constructor's parameters are extracted from next comment:

    ```javascript
    /*!
     * @brief Event Class
     * @param type:Object event event description
     */
     function Event(event) {
     }
    ```

    Here `@brief` is used for class description, and `@param` is used for constructor's parameters documentation.

## CHANGELOG

[CHANGELOG](./CHANGELOG.md)

## License

[MIT](./LICENSE)
