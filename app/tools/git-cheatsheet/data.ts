export type DangerLevel = "safe" | "caution" | "destructive";

export type GitCommand = {
  command: string;
  description: string;
  category: string;
  danger: DangerLevel;
};

export const GIT_CATEGORIES = [
  "All",
  "Basics",
  "Branching",
  "Stashing",
  "Undoing",
  "Rebase",
  "Remote",
  "History",
  "Tags",
  "Config",
  "Advanced",
] as const;

export const DANGER_LEVELS: DangerLevel[] = ["safe", "caution", "destructive"];

export const GIT_COMMANDS: GitCommand[] = [
  // ─── Basics ──────────────────────────────────────────────────────────────────
  { command: "git init", description: "Initialise a new local repository in the current directory.", category: "Basics", danger: "safe" },
  { command: "git clone <url>", description: "Clone a remote repository into a new directory.", category: "Basics", danger: "safe" },
  { command: "git status", description: "Show working tree status — staged, unstaged, and untracked files.", category: "Basics", danger: "safe" },
  { command: "git add <file>", description: "Stage a specific file for the next commit.", category: "Basics", danger: "safe" },
  { command: "git add .", description: "Stage all changes in the current directory.", category: "Basics", danger: "safe" },
  { command: "git add -p", description: "Interactively stage hunks of changes (patch mode).", category: "Basics", danger: "safe" },
  { command: "git commit -m \"message\"", description: "Record staged changes with a commit message.", category: "Basics", danger: "safe" },
  { command: "git commit --amend", description: "Modify the most recent commit — message or staged files.", category: "Basics", danger: "caution" },
  { command: "git commit --amend --no-edit", description: "Amend the last commit without changing its message.", category: "Basics", danger: "caution" },
  { command: "git push", description: "Push commits to the tracked remote branch.", category: "Basics", danger: "safe" },
  { command: "git push -u origin <branch>", description: "Push and set the upstream tracking branch.", category: "Basics", danger: "safe" },
  { command: "git pull", description: "Fetch and merge changes from the tracked remote branch.", category: "Basics", danger: "safe" },
  { command: "git fetch", description: "Download remote changes without merging.", category: "Basics", danger: "safe" },
  { command: "git fetch --prune", description: "Fetch and remove stale remote-tracking branches.", category: "Basics", danger: "safe" },
  { command: "git merge <branch>", description: "Merge the specified branch into the current branch.", category: "Basics", danger: "safe" },
  { command: "git merge --no-ff <branch>", description: "Merge with a merge commit even if fast-forward is possible.", category: "Basics", danger: "safe" },
  { command: "git merge --squash <branch>", description: "Squash all commits from a branch into a single staged change.", category: "Basics", danger: "caution" },

  // ─── Branching ───────────────────────────────────────────────────────────────
  { command: "git branch", description: "List all local branches.", category: "Branching", danger: "safe" },
  { command: "git branch -a", description: "List all local and remote-tracking branches.", category: "Branching", danger: "safe" },
  { command: "git branch <name>", description: "Create a new branch at the current commit.", category: "Branching", danger: "safe" },
  { command: "git branch -d <branch>", description: "Delete a fully merged branch.", category: "Branching", danger: "caution" },
  { command: "git branch -D <branch>", description: "Force-delete a branch regardless of merge status.", category: "Branching", danger: "destructive" },
  { command: "git branch -m <old> <new>", description: "Rename a branch.", category: "Branching", danger: "safe" },
  { command: "git switch <branch>", description: "Switch to an existing branch (modern syntax).", category: "Branching", danger: "safe" },
  { command: "git switch -c <branch>", description: "Create and switch to a new branch.", category: "Branching", danger: "safe" },
  { command: "git checkout <branch>", description: "Switch to an existing branch (classic syntax).", category: "Branching", danger: "safe" },
  { command: "git checkout -b <branch>", description: "Create and switch to a new branch.", category: "Branching", danger: "safe" },
  { command: "git cherry-pick <commit>", description: "Apply the changes from a specific commit onto the current branch.", category: "Branching", danger: "caution" },
  { command: "git cherry-pick <from>..<to>", description: "Apply a range of commits onto the current branch.", category: "Branching", danger: "caution" },

  // ─── Stashing ────────────────────────────────────────────────────────────────
  { command: "git stash", description: "Stash the current working directory changes.", category: "Stashing", danger: "safe" },
  { command: "git stash push -m \"name\"", description: "Stash changes with a descriptive name.", category: "Stashing", danger: "safe" },
  { command: "git stash -u", description: "Stash changes including untracked files.", category: "Stashing", danger: "safe" },
  { command: "git stash list", description: "List all stash entries.", category: "Stashing", danger: "safe" },
  { command: "git stash pop", description: "Apply the latest stash and remove it from the stash list.", category: "Stashing", danger: "safe" },
  { command: "git stash apply stash@{n}", description: "Apply a specific stash without removing it.", category: "Stashing", danger: "safe" },
  { command: "git stash drop stash@{n}", description: "Delete a specific stash entry.", category: "Stashing", danger: "caution" },
  { command: "git stash clear", description: "Delete all stash entries.", category: "Stashing", danger: "destructive" },
  { command: "git stash show -p", description: "Show the diff of the latest stash.", category: "Stashing", danger: "safe" },

  // ─── Undoing ─────────────────────────────────────────────────────────────────
  { command: "git restore <file>", description: "Discard working directory changes for a file.", category: "Undoing", danger: "destructive" },
  { command: "git restore --staged <file>", description: "Unstage a file without discarding changes.", category: "Undoing", danger: "safe" },
  { command: "git reset HEAD~1", description: "Undo the last commit, keeping changes staged.", category: "Undoing", danger: "caution" },
  { command: "git reset --soft HEAD~1", description: "Undo the last commit, keeping changes staged (explicit flag).", category: "Undoing", danger: "caution" },
  { command: "git reset --mixed HEAD~1", description: "Undo the last commit, keeping changes unstaged.", category: "Undoing", danger: "caution" },
  { command: "git reset --hard HEAD~1", description: "Undo the last commit and discard all changes permanently.", category: "Undoing", danger: "destructive" },
  { command: "git revert <commit>", description: "Create a new commit that undoes the changes from a previous commit. Safe for shared branches.", category: "Undoing", danger: "safe" },
  { command: "git clean -fd", description: "Remove untracked files and directories.", category: "Undoing", danger: "destructive" },
  { command: "git clean -n", description: "Dry-run: show what clean would remove.", category: "Undoing", danger: "safe" },

  // ─── Rebase ──────────────────────────────────────────────────────────────────
  { command: "git rebase <branch>", description: "Reapply commits on top of another base branch.", category: "Rebase", danger: "caution" },
  { command: "git rebase -i HEAD~n", description: "Interactive rebase — squash, reorder, edit last n commits.", category: "Rebase", danger: "caution" },
  { command: "git rebase --continue", description: "Continue rebase after resolving conflicts.", category: "Rebase", danger: "caution" },
  { command: "git rebase --abort", description: "Abort an in-progress rebase and restore the original branch.", category: "Rebase", danger: "safe" },
  { command: "git rebase --skip", description: "Skip the current conflicting commit during rebase.", category: "Rebase", danger: "caution" },

  // ─── Remote ──────────────────────────────────────────────────────────────────
  { command: "git remote -v", description: "List all remote connections with their URLs.", category: "Remote", danger: "safe" },
  { command: "git remote add origin <url>", description: "Add a new remote called 'origin'.", category: "Remote", danger: "safe" },
  { command: "git remote set-url origin <url>", description: "Change the URL of the 'origin' remote.", category: "Remote", danger: "caution" },
  { command: "git remote remove <name>", description: "Remove a remote connection.", category: "Remote", danger: "caution" },
  { command: "git push origin --delete <branch>", description: "Delete a remote branch.", category: "Remote", danger: "destructive" },
  { command: "git push --force-with-lease", description: "Force push, but fail if the remote has new commits. Safer than --force.", category: "Remote", danger: "caution" },
  { command: "git push --tags", description: "Push all local tags to the remote.", category: "Remote", danger: "safe" },

  // ─── History ─────────────────────────────────────────────────────────────────
  { command: "git log", description: "Show the full commit history.", category: "History", danger: "safe" },
  { command: "git log --oneline", description: "Show compact one-line commit history.", category: "History", danger: "safe" },
  { command: "git log --oneline --graph --all", description: "Visualise the full branch graph in the terminal.", category: "History", danger: "safe" },
  { command: "git log -p", description: "Show commit history with full diffs.", category: "History", danger: "safe" },
  { command: "git log --author=\"name\"", description: "Filter commit history by author.", category: "History", danger: "safe" },
  { command: "git log --since=\"2 weeks ago\"", description: "Filter commits within a time range.", category: "History", danger: "safe" },
  { command: "git diff", description: "Show unstaged changes in the working directory.", category: "History", danger: "safe" },
  { command: "git diff --staged", description: "Show changes staged for the next commit.", category: "History", danger: "safe" },
  { command: "git diff <branch1>..<branch2>", description: "Show differences between two branches.", category: "History", danger: "safe" },
  { command: "git blame <file>", description: "Show which commit last changed each line of a file.", category: "History", danger: "safe" },
  { command: "git show <commit>", description: "Show the metadata and diff for a specific commit.", category: "History", danger: "safe" },
  { command: "git shortlog -sn", description: "Summarise commits by author, sorted by count.", category: "History", danger: "safe" },

  // ─── Tags ────────────────────────────────────────────────────────────────────
  { command: "git tag", description: "List all tags.", category: "Tags", danger: "safe" },
  { command: "git tag <name>", description: "Create a lightweight tag at the current commit.", category: "Tags", danger: "safe" },
  { command: "git tag -a <name> -m \"msg\"", description: "Create an annotated tag with a message.", category: "Tags", danger: "safe" },
  { command: "git tag -d <name>", description: "Delete a local tag.", category: "Tags", danger: "caution" },
  { command: "git push origin --delete <tag>", description: "Delete a tag from the remote.", category: "Tags", danger: "destructive" },
  { command: "git show <tag>", description: "Show the tag metadata and the tagged commit.", category: "Tags", danger: "safe" },

  // ─── Config ──────────────────────────────────────────────────────────────────
  { command: "git config --list", description: "Show all configuration settings.", category: "Config", danger: "safe" },
  { command: "git config --global user.name \"Name\"", description: "Set the global author name for commits.", category: "Config", danger: "safe" },
  { command: "git config --global user.email \"email\"", description: "Set the global author email for commits.", category: "Config", danger: "safe" },
  { command: "git config --global core.editor vim", description: "Set the default text editor for Git.", category: "Config", danger: "safe" },
  { command: "git config --global alias.st status", description: "Create a 'git st' alias for 'git status'.", category: "Config", danger: "safe" },

  // ─── Advanced ────────────────────────────────────────────────────────────────
  { command: "git reflog", description: "Show a log of all HEAD movements — great for recovering lost commits.", category: "Advanced", danger: "safe" },
  { command: "git bisect start", description: "Start a binary search to find which commit introduced a bug.", category: "Advanced", danger: "safe" },
  { command: "git bisect good <commit>", description: "Mark a commit as known-good during bisect.", category: "Advanced", danger: "safe" },
  { command: "git bisect bad", description: "Mark the current commit as bad during bisect.", category: "Advanced", danger: "safe" },
  { command: "git bisect reset", description: "End the bisect session and return to the original branch.", category: "Advanced", danger: "safe" },
  { command: "git worktree add <path> <branch>", description: "Check out a branch in a separate working directory without switching.", category: "Advanced", danger: "safe" },
  { command: "git submodule add <url>", description: "Add a repository as a submodule of the current repo.", category: "Advanced", danger: "safe" },
  { command: "git submodule update --init --recursive", description: "Initialise and update all submodules.", category: "Advanced", danger: "safe" },
  { command: "git archive --format=zip HEAD > out.zip", description: "Export a zip of the current commit without git history.", category: "Advanced", danger: "safe" },
];
