# ONLYOFFICE Trello Power-Up

Bring full document editing into your Trello boards — powered by [ONLYOFFICE Docs](https://www.onlyoffice.com/docs).

Collaborate on text documents, spreadsheets, and presentations right where you manage your tasks. No switching between apps, no downloads — just open, edit, and save.

## ✨ Key highlights
- **Edit documents directly in Trello.** Open DOCX, XLSX, and PPTX files from any card, right in your browser.
- **Collaborate in real time.** Co-edit documents with teammates using Fast or Strict mode, plus Track Changes, Comments, and built-in Chat.
- **Keep files secure.** Enable JWT protection for secure token-based file access.
- **Stay organized.** All file updates are stored as new versions inside the same Trello card.

<p align="center">
  <a href="https://www.onlyoffice.com/office-for-trello">
    <img width="800" src="https://www.onlyoffice.com/images/templates/office-for-trello/hero/main@2x.png" alt="ONLYOFFICE Trello Power-Up">
  </a>
</p>

## Running ONLYOFFICE Docs

To start editing documents in Trello, you need an instance of [ONLYOFFICE Docs](https://www.onlyoffice.com/docs). You have two ways of doing this.

### ☁️ Option 1: ONLYOFFICE Docs Cloud
No installation needed — just [register here](https://www.onlyoffice.com/docs-registration) and get instant access.
Your registration email includes all required connection details, including the **Document Server address** and **JWT credentials**.

### 🏠 Option 2: Self-hosted ONLYOFFICE Docs
Install ONLYOFFICE Docs on your own infrastructure for full control.
You have two main choices for the ONLYOFFICE Document Server:

* **Community Edition (Free)**: Ideal for small teams and personal use.
  * The **recommended** installation method is [Docker](https://github.com/onlyoffice/Docker-DocumentServer).
  * To install it on Debian, Ubuntu, or other derivatives, click [here](https://helpcenter.onlyoffice.com/docs/installation/docs-community-install-ubuntu.aspx).
* **Enterprise Edition**: Provides scalability for larger organizations. To install, click [here](https://helpcenter.onlyoffice.com/docs/installation/enterprise).

Community Edition vs Enterprise Edition comparison can be found [here](#onlyoffice-docs-editions).

## Connecting the Power-Up

Let's hook up your ONLYOFFICE Power-Up for Trello so you can begin editing files inside Trello. Here's how to do it, step by step.

1. **Install it on your board**

    - Open your Trello board and click **Show menu** (right side).
    - Go to **Power-Ups** → search for **ONLYOFFICE** → click **Add**.
    - Confirm the addition. The Power-Up will then be enabled for your board.

    <p align="center">
      <a href="https://www.onlyoffice.com/office-for-trello">
        <img width="600" src="https://static-blog.onlyoffice.com/wp-content/uploads/2024/11/12120443/1.-Power-Up.png" alt="ONLYOFFICE Trello Power-Up">
      </a>
    </p>

2. **Enter configuration details in Trello**

    - After installing the Power-Up you'll see the ONLYOFFICE button in the card sidebar. Click it and then **Settings**.
    - Enter the following details:
        - **Document Server Address**: The URL of your Docs instance (cloud or on-premises).
        - **JWT Secret** (strongly recommended): Enables secure token-based access to documents. [Learn more](https://api.onlyoffice.com/docs/docs-api/additional-api/signature/)
        - **JWT Header**: If you have custom header naming in your Docs setup, enter it here.

    <p align="center">
      <a href="https://www.onlyoffice.com/office-for-trello">
        <img width="600" src="https://static-blog.onlyoffice.com/wp-content/uploads/2024/11/12120556/3.-Settings.png" alt="ONLYOFFICE Trello Power-Up">
      </a>
    </p>

    Click **Save** to apply your settings.

## 📁 Working with your files in Trello

Once connected, you can start editing right away — no extra logins needed.

1. Open a Trello card that contains a document (DOCX, XLSX, or PPTX).
2. Click the **ONLYOFFICE** button on the right Power-Ups panel.
3. The document opens in an embedded editor powered by ONLYOFFICE Docs.

You can:
- View or edit depending on your access level.
- Collaborate with other Trello users in real time.
- Use comments, chat, version history, and change tracking.

When you save changes, the updated version appears as a **new file** on the same card — preserving the original.
<p align="center">
  <a href="https://www.onlyoffice.com/office-for-trello">
    <img width="600" src="https://static-blog.onlyoffice.com/wp-content/uploads/2024/11/12120520/2.-powerupOpen.png" alt="ONLYOFFICE Trello Power-Up">
  </a>
</p>

## 👥 Access rights in Trello

| Trello role | Document access |
|--------------|----------------|
| **Admin / Normal member** | Can open and edit DOCX, XLSX, and PPTX files. |
| **Observer** | Can view supported file types but cannot edit. |
| **Guests** | View-only access (if file is publicly shared). |

Other file types (PDF, TXT, etc.) can be viewed but not edited.

## ONLYOFFICE Docs editions

Self-hosted ONLYOFFICE Docs offers different versions of its online document editors that can be deployed on your own servers.

**ONLYOFFICE Docs** packaged as Document Server:

* Community Edition 🆓 (`onlyoffice-documentserver` package)
* Enterprise Edition 🏢 (`onlyoffice-documentserver-ee` package)

The table below will help you to make the right choice.

| Pricing and licensing | Community Edition | Enterprise Edition |
| ------------- | ------------- | ------------- |
| | [Get it now](https://www.onlyoffice.com/download-community?utm_source=github&utm_medium=cpc&utm_campaign=GitHubTrello#docs-community)  | [Start Free Trial](https://www.onlyoffice.com/download?utm_source=github&utm_medium=cpc&utm_campaign=GitHubTrello#docs-enterprise)  |
| Cost  | FREE  | [Go to the pricing page](https://www.onlyoffice.com/docs-enterprise-prices?utm_source=github&utm_medium=cpc&utm_campaign=GitHubTrello)  |
| Simultaneous connections | up to 20 maximum  | As in chosen pricing plan |
| Number of users | up to 20 recommended | As in chosen pricing plan |
| License | GNU AGPL v.3 | Proprietary |
| **Support** | **Community Edition** | **Enterprise Edition** |
| Documentation | [Help Center](https://helpcenter.onlyoffice.com/docs/installation/community) | [Help Center](https://helpcenter.onlyoffice.com/docs/installation/enterprise) |
| Standard support | [GitHub](https://github.com/ONLYOFFICE/DocumentServer/issues) or paid | 1 or 3 years support included |
| Premium support | [Contact us](mailto:sales@onlyoffice.com) | [Contact us](mailto:sales@onlyoffice.com) |
| **Services** | **Community Edition** | **Enterprise Edition** |
| Conversion Service                | + | + |
| Document Builder Service          | + | + |
| **Interface** | **Community Edition** | **Enterprise Edition** |
| Tabbed interface                  | + | + |
| Dark theme                        | + | + |
| 125%, 150%, 175%, 200% scaling    | + | + |
| White Label                       | - | - |
| Integrated test example (node.js) | + | + |
| Mobile web editors                | - | +* |
| **Plugins & Macros** | **Community Edition** | **Enterprise Edition** |
| Plugins                           | + | + |
| Macros                            | + | + |
| **Collaborative capabilities** | **Community Edition** | **Enterprise Edition** |
| Two co-editing modes              | + | + |
| Comments                          | + | + |
| Built-in chat                     | + | + |
| Review and tracking changes       | + | + |
| Display modes of tracking changes | + | + |
| Version history                   | + | + |
| **Document Editor features** | **Community Edition** | **Enterprise Edition** |
| Font and paragraph formatting   | + | + |
| Object insertion                | + | + |
| Adding Content control          | + | + |
| Editing Content control         | + | + |
| Layout tools                    | + | + |
| Table of contents               | + | + |
| Navigation panel                | + | + |
| Mail Merge                      | + | + |
| Comparing Documents             | + | + |
| **Spreadsheet Editor features** | **Community Edition** | **Enterprise Edition** |
| Font and paragraph formatting   | + | + |
| Object insertion                | + | + |
| Functions, formulas, equations  | + | + |
| Table templates                 | + | + |
| Pivot tables                    | + | + |
| Data validation                 | + | + |
| Conditional formatting          | + | + |
| Sparklines                      | + | + |
| Sheet Views                     | + | + |
| **Presentation Editor features** | **Community Edition** | **Enterprise Edition** |
| Font and paragraph formatting   | + | + |
| Object insertion                | + | + |
| Transitions                     | + | + |
| Animations                      | + | + |
| Presenter mode                  | + | + |
| Notes                           | + | + |
| **Form creator features** | **Community Edition** | **Enterprise Edition** |
| Adding form fields              | + | + |
| Form preview                    | + | + |
| Saving as PDF                   | + | + |
| **PDF Editor features**      | **Community Edition** | **Enterprise Edition** |
| Text editing and co-editing                                | + | + |
| Work with pages (adding, deleting, rotating)               | + | + |
| Inserting objects (shapes, images, hyperlinks, etc.)       | + | + |
| Text annotations (highlight, underline, cross out, stamps) | + | + |
| Comments                        | + | + |
| Freehand drawings               | + | + |
| Form filling                    | + | + |
| | [Get it now](https://www.onlyoffice.com/download-community?utm_source=github&utm_medium=cpc&utm_campaign=GitHubTrello#docs-community)  | [Start Free Trial](https://www.onlyoffice.com/download?utm_source=github&utm_medium=cpc&utm_campaign=GitHubTrello#docs-enterprise)  |

\* If supported by DMS.

## Need help? User Feedback and Support 💡

* **🐞 Found a bug?** Please report it by creating an [issue](https://github.com/ONLYOFFICE/onlyoffice-trello/issues).
* **❓ Have a question?** Ask our community and developers on the [ONLYOFFICE Forum](https://community.onlyoffice.com).
* **👨‍💻 Need help for developers?** Check our [API documentation](https://api.onlyoffice.com).
* **💡 Want to suggest a feature?** Share your ideas on our [feedback platform](https://feedback.onlyoffice.com/forums/966080-your-voice-matters).