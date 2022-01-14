lint: 
	git diff --name-only --cached --diff-filter=d | grep '**/*\.rb\|**/*\.rake\|Gemfile' | grep -v 'Gemfile.lock' | xargs bundle exec standardrb --extra-details --fail-level A
