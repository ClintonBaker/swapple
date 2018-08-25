# swapple

Interactive CLI menu to toggle commented portions of files.

## Usage

**Install.**

```
npm i -g swapple
```

**Create toggle-able sections of your file.**

For example, here is a mock part of an Apache `httpd.conf` file using swapple comments to allow swapple to handle toggling for us.

```
# swapple start foo
ProxyPass /foo https://foo.com/
ProxyPassReverse /foo https://foo.com/
# swapple end

# swapple start bar
# ProxyPass /bar https://bar.com/
# ProxyPassReverse /bar https://bar.com/
# swapple end
```

**Use swapple to toggle sections on and off.**

```
swapple <path-to-your-file>
```

![gif of swapple in use](swappleexample.gif)

**Expect to find your file properly swapple'd.**

```
# swapple start foo
# ProxyPass /foo https://foo.com/
# ProxyPassReverse /foo https://foo.com/
# swapple end

# swapple start bar
ProxyPass /bar https://bar.com/
ProxyPassReverse /bar https://bar.com/
# swapple end
```

## Development

**Build**

```
npm run build
```

**Test**

```
npm t
```
