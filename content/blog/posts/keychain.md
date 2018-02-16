---
{
  "date": "2017-03-19T16:00:00-05:00",
  "description": "Using the keychain to remove plaintext secrets from your scripts",
  "slug": "storing-secrets-with-keychain",
  "title": "Storing Secrets Using the MacOS Keychain CLI"
}
---

I recently discovered that the MacOS keychain has a command-line interface, and
I decided that instead of storing my secrets on my personal laptop in plaintext,
I could take advantage of the CLI to prevent the secrets from ever being stored
on disk unencrypted.

<!--more-->

### Why it's necessary

There are two universally accepted rules I've seen regarding secrets management.

**1\.** Don't put them directly into your code

```bash
# Don't do this
echo Check out my secret 'jfkdj*$&#3*($JLAFfh131)'
```

**2\.** Don't commit them into git or whatever VCS you're using ([except if
you're doing something like this][1])

```bash
git add secrets.txt
git commit -m 'Huge time saver!'
```

Thus, given these two rules, it follows that your secrets must be stored in some
file outside of your VCS. For example, a common practice I've seen is to have a
file that exports a environment variables, which your code that is being
committed will read and use.

```bash
# This file "env.sh" is not committed into git
export SECRET1='jfkdj*$&#3*($JLAFfh131)'
```

```bash
# Do stuff with secrets
. env.sh
echo Check out my secret $SECRET1
```

Of course environment variables are not the only way to avoid the two pitfalls
above, but regardless of the method, even though the secrets aren't committed
into your VCS, they will still be in plaintext on your computer. This means that
if anyone were to gain unauthorized access to your computer they'd be able to
steal or use your secrets. This is where the MacOS keychain app comes in since
we can use it to encrypt your secrets.

_(As a side note, I figure that at that point, if someone or some program
compromised the security of your computer, you're screwed to the point where
it'd be safer to invalidate those secrets anyways rather than to assume they're
safe in your keychain.)_

### Using the MacOS Keychain CLI

> Keychain Services provides secure storage of passwords, keys, certificates,
> and notes for one or more users. A user can unlock a keychain with a single
> password, and any Keychain Services–aware application can then use that
> keychain to store and retrieve passwords. <sup>[\[1\]][2]</sup>

You can use the keychain either through the Keychain Access app, which is in the
the Utilities folder of your Applications folder, or through the `security`
command in your terminal.

We're going to be using the `security` command. Specifically, we're going to be
using these commands:

* `security create-keychain`
* `security set-keychain-settings`
* `security add-generic-password`
* `security find-generic-password`
* `security delete-generic-password`
* `security delete-keychain`

First we'll run

```
$ security create-keychain
```

which will prompt us for the keychain name and password:

```
$ security create-keychain
  keychain to create: secrets.keychain
  password for new keychain:
  retype password for new keychain:
```

In the above I've created a keychain called `secrets.keychain`. Then we'll run

```
$ security set-keychain-settings -u -t 60 secrets.keychain
```

which makes it such that the `secrets.keychain` locks after 60 seconds of
inactivity, after which, it'll require you to enter the keychain's password
again.

Now we can add secrets to our keychain! We can run

```bash
# -a ties it to a user account
# -s is the name of the secret
# -w specifies the secret
$ security add-generic-password \
  -a $USER \
  -s name \
  -w supersecret \
  secrets.keychain
```

and we'll have a new secret by the name of `name` and with the value of
`supersecret` in our keychain. To retrieve it we can run

```bash
# -a ties it to a user account
# -s is the name of the secret
# -w makes it output the secret only
$ security find-generic-password \
  -a $USER \
  -s name \
  -w \
  secrets.keychain
```

which will output `supersecret` to the console. Now if we wanted to delete that
secret we would run

```bash
# -a ties it to a user account
# -s is the name of the secret
$ security delete-generic-password \
  -a $USER \
  -s name \
  secrets.keychain
```

and finally to get rid of our test keychain we can run

```
$ security delete-keychain secrets.keychain
```

The above is quite verbose and tedious, so I made my own little wrapper around
the security command that you can find [here][3]. Assuming you call it `sec`,
which I did, and you have an existing keychain called `secrets.keychain`, you
can use like it this

```java
Usage:
  sec set <name> <value>
  sec get <name>
  sec rm <name>
  sec ls
```

### Putting it to use

Now assuming you've run

```python
# You can use a single space in front of your
# command to prevent it being saved in shell history
$  sec set secret1 'jfkdj*$&#3*($JLAFfh131)'
```

You can replace hardcoded secret in the environment variable with a call to
`sec`

```bash
# This file is not committed into git
export SECRET1=$(sec get secret1)
```

```bash
# Do stuff with secrets
. env.sh
echo Check out my secret $SECRET1
```

which will prompt you for the password you set for your keychain.

### Conclusion

Using the MacOS Keychain and the `security` CLI, we've solved the problem of
storing secrets in plaintext on your computer.

As for whether that's a problem worth solving, it's for you to decide. Also
there's probably better, more cross platform choices for a secrets managing CLI
such as

* https://www.passwordstore.org/
* https://github.com/lastpass/lastpass-cli

or others that I'm unaware of, but having a simple, native solution is what I
like about the keychain.

[1]: https://github.com/StackExchange/blackbox
[2]: https://goo.gl/BH2Oaj
[3]: https://gist.github.com/AriaFallah/fe7b651ba2652bd301334e011749e4b2
