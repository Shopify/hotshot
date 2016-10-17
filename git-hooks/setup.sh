SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
GIT_HOOK_DIR="$(git rev-parse --show-toplevel)/.git/hooks"
HOOK_DIR="$SCRIPT_DIR/hooks"

cd $HOOK_DIR

for hook in *
do
	SYMLINK_PATH="$GIT_HOOK_DIR/$hook"
	echo "Symlinking $SYMLINK_PATH to $HOOK_DIR/$hook..."
	ln -s -f $HOOK_DIR/$hook $SYMLINK_PATH
	chmod 755 $SYMLINK_PATH
done

exit 0
