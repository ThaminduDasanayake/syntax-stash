// language=TEXT
export const PLACEHOLDER = `<!-- A login form -->
<form class="login-form" onsubmit="handleSubmit(event)">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" placeholder="you@example.com" autocomplete="email" required>

  <label for="password">Password</label>
  <input type="password" id="password" name="password" minlength="8" required>

  <div style="margin-top: 16px; display: flex; gap: 8px;">
    <button type="submit" class="primary">Sign in</button>
    <button type="button" tabindex="-1">Cancel</button>
  </div>

  <img src="/logo.png" alt="Logo" width="120">
</form>`;
