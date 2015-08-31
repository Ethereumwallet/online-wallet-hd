# This script ensures that all dependencies (NPM and Bower) are checked against a whitelist of commits.
# Only non-minified source if checked, so always make sure to minify dependencies yourself. Development
# tools - and perhaps some very large common libraties - are skipped in these checks.

# npm-shrinkwrap.json should be present (e.g. generated with Grunt or
# "npm shrinkwrap"). This contains the list of all (sub) dependencies.

# Ruby is needed as well as the following gems:
# gem install json

# Github API requires authentication because of rate limiting. So run with:
# GITHUB_USER=username GITHUB_TOKEN=personal_access_token ruby check-dependencies.rb

require 'json'
require 'open-uri'


whitelist = JSON.parse(File.read('dependency-whitelist.json'))

@failed = false

##########
# Common #
##########

def first_two_digits_match(a, b)
  # e.g. "1.1.x" and "1.1.3" matches
  #      "1.1.x" and "1.2.0" does not match

  a.split(".")[0].to_i == b.split(".")[0].to_i && a.split(".")[1].to_i == b.split(".")[1].to_i
end


def getJSONfromURL(url)
  if ENV['GITHUB_USER'] and ENV['GITHUB_TOKEN']
    http_options = {:http_basic_authentication=>[ENV['GITHUB_USER'], ENV['GITHUB_TOKEN']]}
    json = JSON.load(open(url, http_options))
  else
    json = JSON.load(open(url))
  end
  return json
end
# apply_math = lambda do |auth, , nom|
#   a.send(fn, b)
# end

# add = apply_math.curry.(:+)
# subtract = apply_math.curry.(:-)
# multiply = apply_math.curry.(:*)
# divide = apply_math.curry.(:/)

def set_dep(requested_version, whitelisted_repo_key, sha)
  if requested_version.include?("git+ssh") # Preserve URL
    return "#{ requested_version.split("#").first }##{ sha }"
  else
    return "#{ whitelisted_repo_key }##{ sha }"
  end
end

def check_commits!(deps, whitelist, output_deps, type)

end

package = JSON.parse(File.read('package.json'))

#########
# NPM   #
#########
if package["name"] == "My-Wallet-HD" # Only My-Wallet-HD uses NPM

  shrinkwrap = JSON.parse(File.read('npm-shrinkwrap.json'))
  deps = shrinkwrap["dependencies"]

  output = JSON.parse(File.read('npm-shrinkwrap.json')) # More reliable than cloning
  output_deps = output["dependencies"]

  check_commits!(deps, whitelist, output_deps, :npm)

  # TODO: shrinkwrap each subdependency and/or disallow packages to install dependencies themselves?

  File.write("build/npm-shrinkwrap.json", JSON.pretty_generate(output))



  output = package.dup

  # output["dependencies"] = {}

  # Remove unessential dev dependencies:
  output["devDependencies"].keys.each do |devDep|
    output["devDependencies"].delete(devDep) unless ["grunt-contrib-clean", "grunt-contrib-concat", "grunt-surround", "grunt-contrib-coffee"].include?(devDep)
  end

  output.delete("author")
  output.delete("contributors")
  output.delete("homepage")
  output.delete("bugs")
  output.delete("license")
  output.delete("repository")
  output["scripts"].delete("test")
  if package["name"] == "My-Wallet-HD"
    output["scripts"]["postinstall"] = "cd node_modules/sjcl && ./configure --with-sha1 && make && cd -"
  elsif package["name"] == "angular-blockchain-wallet"
    output["scripts"].delete("postinstall")
  else
    abort("Package renamed? " + package["name"])
  end

  File.write("build/package.json", JSON.pretty_generate(output))
end

#########
# Bower #
#########
# Only used by the frontend
if package["name"] == "angular-blockchain-wallet"
  bower = JSON.parse(File.read('bower.json'))
  output = bower.dup
  output.delete("authors")
  output.delete("main")
  output.delete("ignore")
  output.delete("license")
  output.delete("keywords")
  # output.delete("devDependencies") # TODO don't load LocalStorageModule in production

  deps = bower["dependencies"]

  check_commits!(deps, whitelist, output["dependencies"], :bower)

  File.write("build/bower.json", JSON.pretty_generate(output))
end

if @failed
  abort "Please fix the above issues..."
end
