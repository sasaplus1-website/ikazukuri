task(:default).clear
task :default do
  system 'rake --silent --tasks'
end

desc 'install gems by Bundler'
task :install do
  sh 'bundle install --path vendor/bundle'
end

desc 'start development server'
task :preview do
  sh 'bundle exec jekyll serve --watch'
end
