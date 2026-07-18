export type DangerLevel = "safe" | "caution" | "destructive";

export type GitCommand = {
  command: string;
  description: string;
  category: string;
  danger: DangerLevel;
};

export const GIT_CATEGORIES = [
  "Advanced",
  "All",
  "Basics",
  "Branching",
  "Config",
  "History",
  "Rebase",
  "Remote",
  "Stashing",
  "Tags",
  "Undoing",
] as const;

export const DANGER_LEVELS: DangerLevel[] = ["caution", "destructive", "safe"];

export const GIT_COMMANDS: GitCommand[] = [
  {
    category: "Advanced",
    command: "git archive --format=zip HEAD > out.zip",
    danger: "safe",
    description: "Export a zip of the current commit without git history.",
  },
  {
    category: "Advanced",
    command: "git bisect bad",
    danger: "safe",
    description: "Mark the current commit as bad during bisect.",
  },
  {
    category: "Advanced",
    command: "git bisect good <commit>",
    danger: "safe",
    description: "Mark a commit as known-good during bisect.",
  },
  {
    category: "Advanced",
    command: "git bisect reset",
    danger: "safe",
    description: "End the bisect session and return to the original branch.",
  },
  {
    category: "Advanced",
    command: "git bisect start",
    danger: "safe",
    description: "Start a binary search to find which commit introduced a bug.",
  },
  // Advanced
  {
    category: "Advanced",
    command: "git reflog",
    danger: "safe",
    description: "Show a log of all HEAD movements — great for recovering lost commits.",
  },
  {
    category: "Advanced",
    command: "git submodule add <url>",
    danger: "safe",
    description: "Add a repository as a submodule of the current repo.",
  },
  {
    category: "Advanced",
    command: "git submodule update --init --recursive",
    danger: "safe",
    description: "Initialise and update all submodules.",
  },
  {
    category: "Advanced",
    command: "git worktree add <path> <branch>",
    danger: "safe",
    description: "Check out a branch in a separate working directory without switching.",
  },
  {
    category: "Basics",
    command: "git add -p",
    danger: "safe",
    description: "Interactively stage hunks of changes (patch mode).",
  },
  {
    category: "Basics",
    command: "git add .",
    danger: "safe",
    description: "Stage all changes in the current directory.",
  },
  {
    category: "Basics",
    command: "git add <file>",
    danger: "safe",
    description: "Stage a specific file for the next commit.",
  },
  {
    category: "Basics",
    command: "git clone <url>",
    danger: "safe",
    description: "Clone a remote repository into a new directory.",
  },
  {
    category: "Basics",
    command: "git commit --amend --no-edit",
    danger: "caution",
    description: "Amend the last commit without changing its message.",
  },
  {
    category: "Basics",
    command: "git commit --amend",
    danger: "caution",
    description: "Modify the most recent commit — message or staged files.",
  },
  {
    category: "Basics",
    command: "git fetch",
    danger: "safe",
    description: "Download remote changes without merging.",
  },
  {
    category: "Basics",
    command: "git fetch --prune",
    danger: "safe",
    description: "Fetch and remove stale remote-tracking branches.",
  },

  // Basics
  {
    category: "Basics",
    command: "git init",
    danger: "safe",
    description: "Initialise a new local repository in the current directory.",
  },
  {
    category: "Basics",
    command: "git merge --no-ff <branch>",
    danger: "safe",
    description: "Merge with a merge commit even if fast-forward is possible.",
  },
  {
    category: "Basics",
    command: "git merge --squash <branch>",
    danger: "caution",
    description: "Squash all commits from a branch into a single staged change.",
  },
  {
    category: "Basics",
    command: "git merge <branch>",
    danger: "safe",
    description: "Merge the specified branch into the current branch.",
  },
  {
    category: "Basics",
    command: "git pull",
    danger: "safe",
    description: "Fetch and merge changes from the tracked remote branch.",
  },
  {
    category: "Basics",
    command: "git push",
    danger: "safe",
    description: "Push commits to the tracked remote branch.",
  },
  {
    category: "Basics",
    command: "git push -u origin <branch>",
    danger: "safe",
    description: "Push and set the upstream tracking branch.",
  },
  {
    category: "Basics",
    command: 'git commit -m "message"',
    danger: "safe",
    description: "Record staged changes with a commit message.",
  },
  {
    category: "Basics",
    command: "git status",
    danger: "safe",
    description: "Show working tree status — staged, unstaged, and untracked files.",
  },
  // Branching
  {
    category: "Branching",
    command: "git branch",
    danger: "safe",
    description: "List all local branches.",
  },
  {
    category: "Branching",
    command: "git branch -a",
    danger: "safe",
    description: "List all local and remote-tracking branches.",
  },
  {
    category: "Branching",
    command: "git branch -d <branch>",
    danger: "caution",
    description: "Delete a fully merged branch.",
  },

  {
    category: "Branching",
    command: "git branch -D <branch>",
    danger: "destructive",
    description: "Force-delete a branch regardless of merge status.",
  },
  {
    category: "Branching",
    command: "git branch -m <old> <new>",
    danger: "safe",
    description: "Rename a branch.",
  },
  {
    category: "Branching",
    command: "git branch <name>",
    danger: "safe",
    description: "Create a new branch at the current commit.",
  },
  {
    category: "Branching",
    command: "git checkout -b <branch>",
    danger: "safe",
    description: "Create and switch to a new branch.",
  },
  {
    category: "Branching",
    command: "git checkout <branch>",
    danger: "safe",
    description: "Switch to an existing branch (classic syntax).",
  },
  {
    category: "Branching",
    command: "git cherry-pick <commit>",
    danger: "caution",
    description: "Apply the changes from a specific commit onto the current branch.",
  },
  {
    category: "Branching",
    command: "git cherry-pick <from>..<to>",
    danger: "caution",
    description: "Apply a range of commits onto the current branch.",
  },
  {
    category: "Branching",
    command: "git switch -c <branch>",
    danger: "safe",
    description: "Create and switch to a new branch.",
  },
  {
    category: "Branching",
    command: "git switch <branch>",
    danger: "safe",
    description: "Switch to an existing branch (modern syntax).",
  },

  {
    category: "Config",
    command: "git config --global alias.st status",
    danger: "safe",
    description: "Create a 'git st' alias for 'git status'.",
  },
  {
    category: "Config",
    command: "git config --global core.editor vim",
    danger: "safe",
    description: "Set the default text editor for Git.",
  },
  // Config
  {
    category: "Config",
    command: "git config --list",
    danger: "safe",
    description: "Show all configuration settings.",
  },
  {
    category: "Config",
    command: 'git config --global user.email "email"',
    danger: "safe",
    description: "Set the global author email for commits.",
  },
  {
    category: "Config",
    command: 'git config --global user.name "Name"',
    danger: "safe",
    description: "Set the global author name for commits.",
  },
  {
    category: "History",
    command: "git blame <file>",
    danger: "safe",
    description: "Show which commit last changed each line of a file.",
  },
  {
    category: "History",
    command: "git diff",
    danger: "safe",
    description: "Show unstaged changes in the working directory.",
  },
  {
    category: "History",
    command: "git diff --staged",
    danger: "safe",
    description: "Show changes staged for the next commit.",
  },
  {
    category: "History",
    command: "git diff <branch1>..<branch2>",
    danger: "safe",
    description: "Show differences between two branches.",
  },

  // History
  {
    category: "History",
    command: "git log",
    danger: "safe",
    description: "Show the full commit history.",
  },
  {
    category: "History",
    command: "git log --oneline",
    danger: "safe",
    description: "Show compact one-line commit history.",
  },
  {
    category: "History",
    command: "git log --oneline --graph --all",
    danger: "safe",
    description: "Visualise the full branch graph in the terminal.",
  },
  {
    category: "History",
    command: "git log -p",
    danger: "safe",
    description: "Show commit history with full diffs.",
  },
  {
    category: "History",
    command: "git shortlog -sn",
    danger: "safe",
    description: "Summarise commits by author, sorted by count.",
  },

  {
    category: "History",
    command: "git show <commit>",
    danger: "safe",
    description: "Show the metadata and diff for a specific commit.",
  },
  {
    category: "History",
    command: 'git log --author="name"',
    danger: "safe",
    description: "Filter commit history by author.",
  },
  {
    category: "History",
    command: 'git log --since="2 weeks ago"',
    danger: "safe",
    description: "Filter commits within a time range.",
  },
  {
    category: "Rebase",
    command: "git rebase --abort",
    danger: "safe",
    description: "Abort an in-progress rebase and restore the original branch.",
  },
  {
    category: "Rebase",
    command: "git rebase --continue",
    danger: "caution",
    description: "Continue rebase after resolving conflicts.",
  },
  {
    category: "Rebase",
    command: "git rebase --skip",
    danger: "caution",
    description: "Skip the current conflicting commit during rebase.",
  },
  {
    category: "Rebase",
    command: "git rebase -i HEAD~n",
    danger: "caution",
    description: "Interactive rebase — squash, reorder, edit last n commits.",
  },

  // Rebase
  {
    category: "Rebase",
    command: "git rebase <branch>",
    danger: "caution",
    description: "Reapply commits on top of another base branch.",
  },
  {
    category: "Remote",
    command: "git push --force-with-lease",
    danger: "caution",
    description: "Force push, but fail if the remote has new commits. Safer than --force.",
  },
  {
    category: "Remote",
    command: "git push --tags",
    danger: "safe",
    description: "Push all local tags to the remote.",
  },
  {
    category: "Remote",
    command: "git push origin --delete <branch>",
    danger: "destructive",
    description: "Delete a remote branch.",
  },
  // Remote
  {
    category: "Remote",
    command: "git remote -v",
    danger: "safe",
    description: "List all remote connections with their URLs.",
  },
  {
    category: "Remote",
    command: "git remote add origin <url>",
    danger: "safe",
    description: "Add a new remote called 'origin'.",
  },
  {
    category: "Remote",
    command: "git remote remove <name>",
    danger: "caution",
    description: "Remove a remote connection.",
  },
  {
    category: "Remote",
    command: "git remote set-url origin <url>",
    danger: "caution",
    description: "Change the URL of the 'origin' remote.",
  },
  // Stashing
  {
    category: "Stashing",
    command: "git stash",
    danger: "safe",
    description: "Stash the current working directory changes.",
  },
  {
    category: "Stashing",
    command: "git stash -u",
    danger: "safe",
    description: "Stash changes including untracked files.",
  },
  {
    category: "Stashing",
    command: "git stash apply stash@{n}",
    danger: "safe",
    description: "Apply a specific stash without removing it.",
  },
  {
    category: "Stashing",
    command: "git stash clear",
    danger: "destructive",
    description: "Delete all stash entries.",
  },

  {
    category: "Stashing",
    command: "git stash drop stash@{n}",
    danger: "caution",
    description: "Delete a specific stash entry.",
  },
  {
    category: "Stashing",
    command: "git stash list",
    danger: "safe",
    description: "List all stash entries.",
  },
  {
    category: "Stashing",
    command: "git stash pop",
    danger: "safe",
    description: "Apply the latest stash and remove it from the stash list.",
  },
  {
    category: "Stashing",
    command: "git stash show -p",
    danger: "safe",
    description: "Show the diff of the latest stash.",
  },
  {
    category: "Stashing",
    command: 'git stash push -m "name"',
    danger: "safe",
    description: "Stash changes with a descriptive name.",
  },
  {
    category: "Tags",
    command: "git push origin --delete <tag>",
    danger: "destructive",
    description: "Delete a tag from the remote.",
  },

  {
    category: "Tags",
    command: "git show <tag>",
    danger: "safe",
    description: "Show the tag metadata and the tagged commit.",
  },
  // Tags
  { category: "Tags", command: "git tag", danger: "safe", description: "List all tags." },
  {
    category: "Tags",
    command: "git tag -d <name>",
    danger: "caution",
    description: "Delete a local tag.",
  },
  {
    category: "Tags",
    command: "git tag <name>",
    danger: "safe",
    description: "Create a lightweight tag at the current commit.",
  },
  {
    category: "Tags",
    command: 'git tag -a <name> -m "msg"',
    danger: "safe",
    description: "Create an annotated tag with a message.",
  },

  {
    category: "Undoing",
    command: "git clean -fd",
    danger: "destructive",
    description: "Remove untracked files and directories.",
  },
  {
    category: "Undoing",
    command: "git clean -n",
    danger: "safe",
    description: "Dry-run: show what clean would remove.",
  },
  {
    category: "Undoing",
    command: "git reset --hard HEAD~1",
    danger: "destructive",
    description: "Undo the last commit and discard all changes permanently.",
  },
  {
    category: "Undoing",
    command: "git reset --mixed HEAD~1",
    danger: "caution",
    description: "Undo the last commit, keeping changes unstaged.",
  },
  {
    category: "Undoing",
    command: "git reset --soft HEAD~1",
    danger: "caution",
    description: "Undo the last commit, keeping changes staged (explicit flag).",
  },
  {
    category: "Undoing",
    command: "git reset HEAD~1",
    danger: "caution",
    description: "Undo the last commit, keeping changes staged.",
  },
  {
    category: "Undoing",
    command: "git restore --staged <file>",
    danger: "safe",
    description: "Unstage a file without discarding changes.",
  },
  // Undoing
  {
    category: "Undoing",
    command: "git restore <file>",
    danger: "destructive",
    description: "Discard working directory changes for a file.",
  },
  {
    category: "Undoing",
    command: "git revert <commit>",
    danger: "safe",
    description:
      "Create a new commit that undoes the changes from a previous commit. Safe for shared branches.",
  },
];
