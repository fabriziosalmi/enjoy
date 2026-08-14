```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Bounty Board - Claim Your Karma</title>
    <style>
        :root {
            --primary-color: #2196f3;
            --bg-color: #ffffff;
            --text-color: #333;
            --border-radius: 8px;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            max-width: 900px;
            margin: 40px auto;
        }

        .bounty-container {
            border: 1px solid #eaecef;
            border-radius: var(--border-radius);
            overflow: hidden; /* Clips overflowing header/footer elements */
            background: var(--bg-color);
        }

        .section-header {
            padding: 20px 30px;
            border-bottom: 1px solid #eaecef;
            font-size: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .section-subtitle {
            padding: 10px 30px;
            border-bottom: 1px solid #eaecef;
            color: var(--primary-color);
            font-size: 1.1rem;
            display: flex;
            justify-content: space-between;
        }

        /* Table specific fixes */
        .bounty-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 400px; /* Prevents squashing on mobile */
        }

        .bounty-table th, 
        .bounty-table td {
            padding: 12px 30px;
            text-align: left;
            border-bottom: 1px solid #f6f8fa;
            font-size: 0.95rem;
        }

        .bounty-table th {
            background-color: #fafbfc;
            color: #444;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Aligning the status emoji - a common pain point */
        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            vertical-align: middle;
        }

        /* Specific styling for the meta-data footer */
        .meta-footer {
            display: flex;
            gap: 30px;
            padding: 15px 30px;
            font-size: 0.8rem;
            color: #6a737c;
            background-color: #fafbfc;
        }

        .meta-footer span {
            display: flex;
            align-items: center;
        }
    </style>
</head>
<body>

<article class="bounty-container">
    
    <!-- Main Title -->
    <header class="section-header">
        <h1>🏆 Active Bounties</h1>
        <small>Track open bounties and claim your karma!</small>
    </header>

    <!-- Intro / Logic Guide -->
    <div class="section-subtitle">
        <strong>How it works:</strong> 
        <ol style="margin: 0; margin-left: 24px;">
            <li>Find an issue with the <code>bounty</code> label</li>
            <li>Comment "Claiming this bounty"</li>
            <li>Submit a PR that fixes it</li>
            <li>Earn bonus karma!</li>
        </ol>
    </div>

    <!-- Value Reference -->
    <table class="bounty-table">
        <thead>
            <tr>
                <th style="width: 20%">Difficulty</th>
                <th>Bonus Karma</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Easy</strong></td>
                <td>+10 🪙</td>
            </tr>
            <tr>
                <td><strong>Medium</strong></td>
                <td>+25 🪙</td>
            </tr>
            <tr>
                <td><strong>Hard</strong></td>
                <td>+50 🪙</td>
            </tr>
            <tr>
                <td><strong>Epic</strong></td>
                <td>+100 🪙</td>
            </tr>
        </tbody>
    </table>

    <!-- The Current Bounties Grid -->
    <div class="section-subtitle">
        <h3 style="margin:0; font-size:1rem;">Current Bounties (<span id="count">1</span> open)</h3>
    </div>

    <table class="bounty-table" data-bounty-target="#current-row">
        <thead>
            <tr>
                <th width="25%">Issue</th>
                <th style="flex: 2;">Title / Description</th>
                <th width="15%">Status</th>
            </tr>
        </thead>
        <tbody>
            <!-- The Recursive Self-Reference -->
            <tr id="current-row">
                <td><a href="#" class="bounty-link">#8</a></td>
                <td>Bounty Board - Claim Your Karma</td>
                <td style="text-align: right;">
                    <span class="status-badge" style="background-color: #d1fae5; color: #065f46;">🟢 Open</span>
                </td>
            </tr>

             <!-- Recently Claimed Section (Hidden if empty) -->
            <tr class="recently-claimed-row">
                <td><a href="#">#10</a></td>
                <td>Bug Fix in Core Engine</td>
                <td style="text-align: right;">✓</td>
            </tr>
        </tbody>
    </table>

    <!-- Dynamic Footer -->
    <footer class="meta-footer">
        <span>Last updated: <time datetime="2026-08-14">Aug 14, 2026</time></span>
        <span>Hunters: <strong>tanu123421</strong></span>
    </footer>

</article>

<script>
    // Script to handle dynamic row height adjustments
    // ensuring the header and first data row match heights
    document.addEventListener('DOMContentLoaded', () => {
        const rows = document.querySelectorAll('.bounty-table tbody tr');
        
        if(rows.length > 1) {
            const headerHeight = rows[0].offsetHeight;
            rows.forEach(row => {
                row.style.minHeight = `${headerHeight}px`;
            });
        }
    });
</script>

</body>
</html>
```