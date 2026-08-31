// ============================================================
// CyberCompile - Main JavaScript
// Navigation tree, search, markdown rendering
// ============================================================

// Navigation data structure (mirrors content/ directory)
const navigation = {
    "Foundations": {
        "type": "section",
        "children": {
            "01 Foundations": {
                "type": "directory",
                "path": "content/01-foundations",
                "children": {
                    "Certifications": {
                        "type": "directory",
                        "path": "content/01-foundations/certifications",
                        "children": {
                            "Index": { "type": "file", "path": "content/01-foundations/certifications/index.md", "file": "index.md" }
                        }
                    },
                    "Courseware": {
                        "type": "directory",
                        "path": "content/01-foundations/courseware",
                        "children": {
                            "Index": { "type": "file", "path": "content/01-foundations/courseware/index.md", "file": "index.md" }
                        }
                    },
                    "Fundamentals": {
                        "type": "directory",
                        "path": "content/01-foundations/fundamentals",
                        "children": {
                            "Cryptography": {
                                "type": "directory",
                                "path": "content/01-foundations/fundamentals/cryptography",
                                "children": {
                                    "Index": { "type": "file", "path": "content/01-foundations/fundamentals/cryptography/index.md", "file": "index.md" }
                                }
                            },
                            "Networking": {
                                "type": "directory",
                                "path": "content/01-foundations/fundamentals/networking",
                                "children": {
                                    "Index": { "type": "file", "path": "content/01-foundations/fundamentals/networking/index.md", "file": "index.md" }
                                }
                            },
                            "Operating Systems": {
                                "type": "directory",
                                "path": "content/01-foundations/fundamentals/operating-systems",
                                "children": {
                                    "Index": { "type": "file", "path": "content/01-foundations/fundamentals/operating-systems/index.md", "file": "index.md" }
                                }
                            },
                            "Scripting": {
                                "type": "directory",
                                "path": "content/01-foundations/fundamentals/scripting",
                                "children": {
                                    "Index": { "type": "file", "path": "content/01-foundations/fundamentals/scripting/index.md", "file": "index.md" }
                                }
                            }
                        }
                    },
                    "Glossary": {
                        "type": "directory",
                        "path": "content/01-foundations/glossary",
                        "children": {
                            "Index": { "type": "file", "path": "content/01-foundations/glossary/index.md", "file": "index.md" }
                        }
                    },
                    "Roadmaps": {
                        "type": "directory",
                        "path": "content/01-foundations/roadmaps",
                        "children": {
                            "Application Security": {
                                "type": "directory",
                                "path": "content/01-foundations/roadmaps/application-security",
                                "children": {
                                    "Index": { "type": "file", "path": "content/01-foundations/roadmaps/application-security/index.md", "file": "index.md" }
                                }
                            },
                            "Cloud Security": {
                                "type": "directory",
                                "path": "content/01-foundations/roadmaps/cloud-security",
                                "children": {
                                    "Index": { "type": "file", "path": "content/01-foundations/roadmaps/cloud-security/index.md", "file": "index.md" }
                                }
                            },
                            "Defensive Security": {
                                "type": "directory",
                                "path": "content/01-foundations/roadmaps/defensive-security",
                                "children": {
                                    "Index": { "type": "file", "path": "content/01-foundations/roadmaps/defensive-security/index.md", "file": "index.md" }
                                }
                            },
                            "Digital Forensics & Incident Response": {
                                "type": "directory",
                                "path": "content/01-foundations/roadmaps/digital-forensics-incident-response",
                                "children": {
                                    "Index": { "type": "file", "path": "content/01-foundations/roadmaps/digital-forensics-incident-response/index.md", "file": "index.md" }
                                }
                            },
                            "Governance, Risk & Compliance": {
                                "type": "directory",
                                "path": "content/01-foundations/roadmaps/governance-risk-compliance",
                                "children": {
                                    "Index": { "type": "file", "path": "content/01-foundations/roadmaps/governance-risk-compliance/index.md", "file": "index.md" }
                                }
                            },
                            "Offensive Security": {
                                "type": "directory",
                                "path": "content/01-foundations/roadmaps/offensive-security",
                                "children": {
                                    "Index": { "type": "file", "path": "content/01-foundations/roadmaps/offensive-security/index.md", "file": "index.md" },
                                    "Roadmap": { "type": "file", "path": "content/01-foundations/roadmaps/offensive-security-roadmap.md", "file": "offensive-security-roadmap.md" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "Hands-On Work": {
        "type": "section",
        "children": {
            "02 Hands-On Work": {
                "type": "directory",
                "path": "content/02-hands-on-work",
                "children": {
                    "Home Labs": {
                        "type": "directory",
                        "path": "content/02-hands-on-work/home-labs",
                        "children": {
                            "Index": { "type": "file", "path": "content/02-hands-on-work/home-labs/index.md", "file": "index.md" }
                        }
                    },
                    "Vulnerable Applications": {
                        "type": "directory",
                        "path": "content/02-hands-on-work/vulnerable-apps",
                        "children": {
                            "Index": { "type": "file", "path": "content/02-hands-on-work/vulnerable-apps/index.md", "file": "index.md" }
                        }
                    }
                }
            }
        }
    },
    "Toolkit": {
        "type": "section",
        "children": {
            "03 Toolkit": {
                "type": "directory",
                "path": "content/03-toolkit",
                "children": {
                    "Reconnaissance": {
                        "type": "directory",
                        "path": "content/03-toolkit/reconnaissance",
                        "children": {
                            "Index": { "type": "file", "path": "content/03-toolkit/reconnaissance/index.md", "file": "index.md" }
                        }
                    },
                    "Scanning & Enumeration": {
                        "type": "directory",
                        "path": "content/03-toolkit/scanning-enumeration",
                        "children": {
                            "Index": { "type": "file", "path": "content/03-toolkit/scanning-enumeration/index.md", "file": "index.md" }
                        }
                    },
                    "Exploitation": {
                        "type": "directory",
                        "path": "content/03-toolkit/exploitation",
                        "children": {
                            "Index": { "type": "file", "path": "content/03-toolkit/exploitation/index.md", "file": "index.md" }
                        }
                    },
                    "Post-Exploitation": {
                        "type": "directory",
                        "path": "content/03-toolkit/post-exploitation",
                        "children": {
                            "Index": { "type": "file", "path": "content/03-toolkit/post-exploitation/index.md", "file": "index.md" }
                        }
                    },
                    "Password Cracking": {
                        "type": "directory",
                        "path": "content/03-toolkit/password-cracking",
                        "children": {
                            "Index": { "type": "file", "path": "content/03-toolkit/password-cracking/index.md", "file": "index.md" }
                        }
                    },
                    "Network Defense": {
                        "type": "directory",
                        "path": "content/03-toolkit/network-defense",
                        "children": {
                            "Index": { "type": "file", "path": "content/03-toolkit/network-defense/index.md", "file": "index.md" }
                        }
                    },
                    "Cloud Security Tools": {
                        "type": "directory",
                        "path": "content/03-toolkit/cloud-security-tools",
                        "children": {
                            "Index": { "type": "file", "path": "content/03-toolkit/cloud-security-tools/index.md", "file": "index.md" }
                        }
                    },
                    "Container & Kubernetes Security": {
                        "type": "directory",
                        "path": "content/03-toolkit/container-kubernetes-security",
                        "children": {
                            "Index": { "type": "file", "path": "content/03-toolkit/container-kubernetes-security/index.md", "file": "index.md" }
                        }
                    },
                    "Forensics Tools": {
                        "type": "directory",
                        "path": "content/03-toolkit/forensics-tools",
                        "children": {
                            "Index": { "type": "file", "path": "content/03-toolkit/forensics-tools/index.md", "file": "index.md" }
                        }
                    },
                    "Malware Analysis Tools": {
                        "type": "directory",
                        "path": "content/03-toolkit/malware-analysis-tools",
                        "children": {
                            "Index": { "type": "file", "path": "content/03-toolkit/malware-analysis-tools/index.md", "file": "index.md" }
                        }
                    },
                    "OSINT Tools": {
                        "type": "directory",
                        "path": "content/03-toolkit/osint-tools",
                        "children": {
                            "Index": { "type": "file", "path": "content/03-toolkit/osint-tools/index.md", "file": "index.md" }
                        }
                    },
                    "Tool Spotlight": {
                        "type": "directory",
                        "path": "content/03-toolkit/tool-spotlight",
                        "children": {
                            "Index": { "type": "file", "path": "content/03-toolkit/tool-spotlight/index.md", "file": "index.md" }
                        }
                    }
                }
            }
        }
    },
    "Cheatsheets": {
        "type": "section",
        "children": {
            "04 Cheatsheets": {
                "type": "directory",
                "path": "content/04-cheatsheets",
                "children": {
                    "Command Cheatsheets": {
                        "type": "directory",
                        "path": "content/04-cheatsheets/command-cheatsheets",
                        "children": {
                            "Index": { "type": "file", "path": "content/04-cheatsheets/command-cheatsheets/index.md", "file": "index.md" }
                        }
                    },
                    "Frameworks": {
                        "type": "directory",
                        "path": "content/04-cheatsheets/frameworks",
                        "children": {
                            "Index": { "type": "file", "path": "content/04-cheatsheets/frameworks/index.md", "file": "index.md" }
                        }
                    },
                    "Payload Cheatsheets": {
                        "type": "directory",
                        "path": "content/04-cheatsheets/payload-cheatsheets",
                        "children": {
                            "Index": { "type": "file", "path": "content/04-cheatsheets/payload-cheatsheets/index.md", "file": "index.md" }
                        }
                    }
                }
            }
        }
    },
    "Research": {
        "type": "section",
        "children": {
            "05 Research": {
                "type": "directory",
                "path": "content/05-research",
                "children": {
                    "Blogs": {
                        "type": "directory",
                        "path": "content/05-research/blogs",
                        "children": {
                            "Index": { "type": "file", "path": "content/05-research/blogs/index.md", "file": "index.md" }
                        }
                    },
                    "Books": {
                        "type": "directory",
                        "path": "content/05-research/books",
                        "children": {
                            "Index": { "type": "file", "path": "content/05-research/books/index.md", "file": "index.md" }
                        }
                    }
                }
            }
        }
    },
    "GRC": {
        "type": "section",
        "children": {
            "06 GRC": {
                "type": "directory",
                "path": "content/06-grc",
                "children": {
                    "Framework Primers": {
                        "type": "directory",
                        "path": "content/06-grc/framework-primers",
                        "children": {
                            "Index": { "type": "file", "path": "content/06-grc/framework-primers/index.md", "file": "index.md" }
                        }
                    },
                    "Templates": {
                        "type": "directory",
                        "path": "content/06-grc/templates",
                        "children": {
                            "Index": { "type": "file", "path": "content/06-grc/templates/index.md", "file": "index.md" }
                        }
                    }
                }
            }
        }
    },
    "DFIR & Malware Analysis": {
        "type": "section",
        "children": {
            "07 DFIR & Malware Analysis": {
                "type": "directory",
                "path": "content/07-dfir-malware-analysis",
                "children": {
                    "Incident Response Playbooks": {
                        "type": "directory",
                        "path": "content/07-dfir-malware-analysis/ir-playbooks",
                        "children": {
                            "Index": { "type": "file", "path": "content/07-dfir-malware-analysis/ir-playbooks/index.md", "file": "index.md" }
                        }
                    },
                    "Memory Forensics": {
                        "type": "directory",
                        "path": "content/07-dfir-malware-analysis/memory-forensics",
                        "children": {
                            "Index": { "type": "file", "path": "content/07-dfir-malware-analysis/memory-forensics/index.md", "file": "index.md" }
                        }
                    },
                    "Sandboxing Guides": {
                        "type": "directory",
                        "path": "content/07-dfir-malware-analysis/sandboxing-guides",
                        "children": {
                            "Index": { "type": "file", "path": "content/07-dfir-malware-analysis/sandboxing-guides/index.md", "file": "index.md" }
                        }
                    },
                    "YARA Rules": {
                        "type": "directory",
                        "path": "content/07-dfir-malware-analysis/yara-rules",
                        "children": {
                            "Index": { "type": "file", "path": "content/07-dfir-malware-analysis/yara-rules/index.md", "file": "index.md" }
                        }
                    }
                }
            }
        }
    },
    "Scripts": {
        "type": "section",
        "children": {
            "08 Scripts": {
                "type": "directory",
                "path": "content/08-scripts",
                "children": {
                    "Index": { "type": "file", "path": "content/08-scripts/index.md", "file": "index.md" }
                }
            }
        }
    }
};

// Search index (flat list of all pages)
const searchIndex = [
    { title: "Index", path: "content/01-foundations/certifications/index.md", section: "Foundations / Certifications" },
    { title: "Index", path: "content/01-foundations/courseware/index.md", section: "Foundations / Courseware" },
    { title: "Index", path: "content/01-foundations/fundamentals/cryptography/index.md", section: "Foundations / Fundamentals / Cryptography" },
    { title: "Index", path: "content/01-foundations/fundamentals/networking/index.md", section: "Foundations / Fundamentals / Networking" },
    { title: "Index", path: "content/01-foundations/fundamentals/operating-systems/index.md", section: "Foundations / Fundamentals / Operating Systems" },
    { title: "Index", path: "content/01-foundations/fundamentals/scripting/index.md", section: "Foundations / Fundamentals / Scripting" },
    { title: "Index", path: "content/01-foundations/glossary/index.md", section: "Foundations / Glossary" },
    { title: "Index", path: "content/01-foundations/roadmaps/application-security/index.md", section: "Foundations / Roadmaps / Application Security" },
    { title: "Index", path: "content/01-foundations/roadmaps/cloud-security/index.md", section: "Foundations / Roadmaps / Cloud Security" },
    { title: "Index", path: "content/01-foundations/roadmaps/defensive-security/index.md", section: "Foundations / Roadmaps / Defensive Security" },
    { title: "Index", path: "content/01-foundations/roadmaps/digital-forensics-incident-response/index.md", section: "Foundations / Roadmaps / Digital Forensics & Incident Response" },
    { title: "Index", path: "content/01-foundations/roadmaps/governance-risk-compliance/index.md", section: "Foundations / Roadmaps / Governance, Risk & Compliance" },
    { title: "Index", path: "content/01-foundations/roadmaps/offensive-security/index.md", section: "Foundations / Roadmaps / Offensive Security" },
    { title: "Roadmap", path: "content/01-foundations/roadmaps/offensive-security-roadmap.md", section: "Foundations / Roadmaps / Offensive Security" },
    { title: "Index", path: "content/02-hands-on-work/home-labs/index.md", section: "Hands-On Work / Home Labs" },
    { title: "Index", path: "content/02-hands-on-work/vulnerable-apps/index.md", section: "Hands-On Work / Vulnerable Applications" },
    { title: "Index", path: "content/03-toolkit/reconnaissance/index.md", section: "Toolkit / Reconnaissance" },
    { title: "Index", path: "content/03-toolkit/scanning-enumeration/index.md", section: "Toolkit / Scanning & Enumeration" },
    { title: "Index", path: "content/03-toolkit/exploitation/index.md", section: "Toolkit / Exploitation" },
    { title: "Index", path: "content/03-toolkit/post-exploitation/index.md", section: "Toolkit / Post-Exploitation" },
    { title: "Index", path: "content/03-toolkit/password-cracking/index.md", section: "Toolkit / Password Cracking" },
    { title: "Index", path: "content/03-toolkit/network-defense/index.md", section: "Toolkit / Network Defense" },
    { title: "Index", path: "content/03-toolkit/cloud-security-tools/index.md", section: "Toolkit / Cloud Security Tools" },
    { title: "Index", path: "content/03-toolkit/container-kubernetes-security/index.md", section: "Toolkit / Container & Kubernetes Security" },
    { title: "Index", path: "content/03-toolkit/forensics-tools/index.md", section: "Toolkit / Forensics Tools" },
    { title: "Index", path: "content/03-toolkit/malware-analysis-tools/index.md", section: "Toolkit / Malware Analysis Tools" },
    { title: "Index", path: "content/03-toolkit/osint-tools/index.md", section: "Toolkit / OSINT Tools" },
    { title: "Index", path: "content/03-toolkit/tool-spotlight/index.md", section: "Toolkit / Tool Spotlight" },
    { title: "Index", path: "content/04-cheatsheets/command-cheatsheets/index.md", section: "Cheatsheets / Command Cheatsheets" },
    { title: "Index", path: "content/04-cheatsheets/frameworks/index.md", section: "Cheatsheets / Frameworks" },
    { title: "Index", path: "content/04-cheatsheets/payload-cheatsheets/index.md", section: "Cheatsheets / Payload Cheatsheets" },
    { title: "Index", path: "content/05-research/blogs/index.md", section: "Research / Blogs" },
    { title: "Index", path: "content/05-research/books/index.md", section: "Research / Books" },
    { title: "Index", path: "content/06-grc/framework-primers/index.md", section: "GRC / Framework Primers" },
    { title: "Index", path: "content/06-grc/templates/index.md", section: "GRC / Templates" },
    { title: "Index", path: "content/07-dfir-malware-analysis/ir-playbooks/index.md", section: "DFIR & Malware Analysis / Incident Response Playbooks" },
    { title: "Index", path: "content/07-dfir-malware-analysis/memory-forensics/index.md", section: "DFIR & Malware Analysis / Memory Forensics" },
    { title: "Index", path: "content/07-dfir-malware-analysis/sandboxing-guides/index.md", section: "DFIR & Malware Analysis / Sandboxing Guides" },
    { title: "Index", path: "content/07-dfir-malware-analysis/yara-rules/index.md", section: "DFIR & Malware Analysis / YARA Rules" },
    { title: "Index", path: "content/08-scripts/index.md", section: "Scripts" }
];

// ============================================================
// DOM Ready
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearch();
    initMobileNav();
});

// ============================================================
// Navigation Tree
// ============================================================

function initNavigation() {
    const navTree = document.getElementById('nav-tree');
    const footerNav = document.getElementById('footer-nav');
    
    if (navTree) {
        navTree.innerHTML = buildTreeHTML(navigation, 'nav-tree');
    }
    
    if (footerNav) {
        footerNav.innerHTML = buildFooterNavHTML(navigation);
    }
}

function buildTreeHTML(tree, parentClass = '') {
    let html = '<ul>';
    
    for (const [name, data] of Object.entries(tree)) {
        if (data.type === 'section') {
            html += `<li><a href="#${slugify(name)}" class="section-link">${escapeHTML(name)}</a>`;
            html += buildTreeHTML(data.children, parentClass);
            html += '</li>';
        } else if (data.type === 'directory') {
            const hasChildren = Object.keys(data.children).length > 0;
            html += `<li class="${hasChildren ? 'has-children' : ''}">`;
            html += `<a href="#" data-path="${data.path}" class="tree-link">${escapeHTML(name)}</a>`;
            if (hasChildren) {
                html += buildTreeHTML(data.children, parentClass);
            }
            html += '</li>';
        } else if (data.type === 'file') {
            html += `<li><a href="#" data-file="${data.path}" class="file-link">${escapeHTML(name)}</a></li>`;
        }
    }
    
    html += '</ul>';
    return html;
}

function buildFooterNavHTML(tree) {
    let html = '';
    
    for (const [sectionName, sectionData] of Object.entries(tree)) {
        html += `<li><a href="#${slugify(sectionName)}">${escapeHTML(sectionName)}</a></li>`;
    }
    
    return html;
}

// Initialize tree interactions
document.addEventListener('click', (e) => {
    const treeLink = e.target.closest('.tree-link');
    const fileLink = e.target.closest('.file-link');
    
    if (treeLink) {
        e.preventDefault();
        const li = treeLink.closest('li');
        const isExpanded = li.classList.contains('expanded');
        
        // Collapse all siblings at same level
        const parentUl = li.parentElement;
        if (parentUl && parentUl.parentElement) {
            const siblings = parentUl.parentElement.querySelectorAll(':scope > li');
            siblings.forEach(sibling => {
                if (sibling !== li) {
                    sibling.classList.remove('expanded');
                    sibling.querySelector('ul')?.removeAttribute('style');
                }
            });
        }
        
        // Toggle this item
        li.classList.toggle('expanded');
        
        const childUl = li.querySelector('ul');
        if (childUl) {
            if (isExpanded) {
                childUl.style.display = 'none';
            } else {
                childUl.style.display = 'block';
            }
        }
    }
    
    if (fileLink) {
        e.preventDefault();
        const filePath = fileLink.dataset.file;
        if (filePath) {
            loadMarkdownFile(filePath);
            
            // Update active state
            document.querySelectorAll('.tree-link, .file-link').forEach(el => {
                el.closest('li')?.classList.remove('active');
            });
            fileLink.closest('li')?.classList.add('active');
        }
    }
    
    // Handle section links
    const sectionLink = e.target.closest('.section-link');
    if (sectionLink) {
        e.preventDefault();
        const targetId = sectionLink.getAttribute('href').slice(1);
        
        // Find and expand the section in the tree
        const sectionItems = document.querySelectorAll(`#nav-tree .section-link`);
        sectionItems.forEach(item => {
            item.closest('li')?.classList.toggle('active', item === sectionLink);
        });
        
        // Scroll to the section in content area
        document.getElementById('nav-tree')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// ============================================================
// Markdown Loading & Rendering
// ============================================================

async function loadMarkdownFile(filePath) {
    const contentDisplay = document.getElementById('content-display');
    const pageTitle = document.getElementById('page-title');
    const pageSection = document.getElementById('page-section');
    const editLink = document.getElementById('edit-link');
    
    if (!contentDisplay) return;
    
    // Show loading state
    contentDisplay.innerHTML = `
        <div class="placeholder-content">
            <div class="loader"></div>
            <p>Loading...</p>
        </div>
    `;
    
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load: ${filePath}`);
        }
        
        const markdown = await response.text();
        const html = renderMarkdown(markdown);
        
        // Extract title from first heading or filename
        const titleMatch = markdown.match(/^#\s+(.+)$/m);
        const displayTitle = titleMatch ? titleMatch[1] : filePath.split('/').pop().replace('.md', '');
        
        // Update UI
        if (pageTitle) pageTitle.textContent = displayTitle;
        
        const sectionMatch = filePath.match(/content\/(.+)\/.+/);
        if (pageSection && sectionMatch) {
            pageSection.textContent = sectionMatch[1].replace(/-/g, ' ');
        }
        
        if (editLink) {
            editLink.href = `https://github.com/cyber-compile/knowledge-base/blob/main/${filePath}`;
        }
        
        contentDisplay.innerHTML = html;
        
        // Update URL hash
        if (history.pushState) {
            history.pushState(null, '', `#${encodeURIComponent(filePath)}`);
        }
        
    } catch (error) {
        contentDisplay.innerHTML = `
            <div class="placeholder-content error">
                <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <p>Error loading content: ${error.message}</p>
            </div>
        `;
    }
}

// Handle browser back/forward
window.addEventListener('popstate', () => {
    const hash = location.hash.slice(1);
    if (hash) {
        const decoded = decodeURIComponent(hash);
        if (decoded.endsWith('.md')) {
            loadMarkdownFile(decoded);
        }
    }
});

// Check for hash on load
if (location.hash) {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash.endsWith('.md')) {
        loadMarkdownFile(hash);
    }
}

// ============================================================
// Markdown Renderer (Simple)
// ============================================================

function renderMarkdown(md) {
    // Escape HTML first
    let html = md
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // Code blocks (```code```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
        const langClass = lang ? `language-${lang}` : '';
        return `<pre><code class="${langClass}">${escapeHTML(code.trim())}</code></pre>`;
    });
    
    // Inline code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Headers
    html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // bold and italic
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/___(.*?)___/g, '<strong><em>$1</em></strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Strikethrough
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');
    
    // unordered lists
    html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // numbered lists
    html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
    
    // blockquotes
    html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    // horizontal rules
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/^\*\*\*$/gm, '<hr>');
    
    // Tables (basic)
    html = html.replace(/\|(.+)\|/g, (match, content) => {
        if (match.includes('---')) return '<hr>';
        const cells = content.split('|').filter(c => c.trim());
        if (cells.length > 1) {
            const isHeader = html.includes('<th>') && match.includes('---');
            const tag = isHeader ? 'th' : 'td';
            return '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
        }
        return match;
    });
    
    // Wrap consecutive table rows
    html = html.replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>');
    
    // Paragraphs
    html = html.replace(/\n\n(?!<)/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul|<ol|<pre|<blockquote|<table|<hr)<\/p>/g, '$1');
    html = html.replace(/(<\/ul>|<\/ol>|<\/pre>|<\/blockquote>|<\/table>)<\/p>/g, '$1');
    
    return html;
}

// ============================================================
// Search
// ============================================================

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchClear = document.getElementById('search-clear');
    
    if (!searchInput || !searchResults) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        
        if (searchClear) {
            searchClear.classList.toggle('visible', query.length > 0);
        }
        
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        
        const results = performSearch(query);
        displaySearchResults(results, searchResults);
    });
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchResults.innerHTML = '';
            searchInput.blur();
        }
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const items = searchResults.querySelectorAll('.search-result-item');
            if (items.length === 0) return;
            
            const currentIndex = document.querySelector('.search-result-item:hover')?.dataset.index;
            let newIndex;
            
            if (e.key === 'ArrowDown') {
                newIndex = currentIndex !== undefined ? parseInt(currentIndex) + 1 : 0;
                if (newIndex >= items.length) newIndex = 0;
            } else {
                newIndex = currentIndex !== undefined ? parseInt(currentIndex) - 1 : items.length - 1;
                if (newIndex < 0) newIndex = items.length - 1;
            }
            
            items.forEach((item, i) => {
                item.classList.toggle('hover', i === newIndex);
                if (i === newIndex) {
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        }
        
        if (e.key === 'Enter') {
            const hovered = searchResults.querySelector('.search-result-item.hover');
            if (hovered) {
                hovered.click();
            } else {
                const first = searchResults.querySelector('.search-result-item');
                if (first) first.click();
            }
        }
    });
    
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchResults.innerHTML = '';
            searchInput.focus();
        });
    }
    
    // Focus search with Ctrl/Cmd + K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput?.focus();
        }
    });
}

function performSearch(query) {
    const results = [];
    const seen = new Set();
    
    for (const item of searchIndex) {
        const title = item.title.toLowerCase();
        const section = item.section.toLowerCase();
        const path = item.path.toLowerCase();
        
        let score = 0;
        
        // Exact match in title
        if (title === query) score += 100;
        // Title contains query
        else if (title.includes(query)) score += 50;
        // Section contains query
        else if (section.includes(query)) score += 30;
        // Partial match in title
        else if (title.startsWith(query)) score += 40;
        // Path match
        else if (path.includes(query)) score += 20;
        
        if (score > 0 && !seen.has(item.path)) {
            seen.add(item.path);
            results.push({ ...item, score });
        }
    }
    
    // Sort by score descending
    return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

function displaySearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<div class="search-no-results">No results found. Try a different search term.</div>';
        return;
    }
    
    container.innerHTML = results.map((result, i) => `
        <div class="search-result-item" data-index="${i}" data-path="${result.path}">
            <h4>${escapeHTML(result.title)}</h4>
            <p>${escapeHTML(result.section)}</p>
            <div class="result-path">${escapeHTML(result.path)}</div>
        </div>
    `).join('');
    
    // Add click handlers
    container.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const path = item.dataset.path;
            if (path) {
                loadMarkdownFile(path);
                document.getElementById('search-input').value = '';
                container.innerHTML = '';
            }
        });
    });
}

// ============================================================
// Mobile Navigation
// ============================================================

function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        
        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
            }
        });
    }
}

// ============================================================
// Utilities
// ============================================================

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// ============================================================
// Smooth scroll for internal links
// ============================================================

document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link && link.getAttribute('href') !== '#') {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});
