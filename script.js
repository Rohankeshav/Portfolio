/* Agentic Console - portfolio interactions */
(function () {
    "use strict";

    // Mark doc as JS-ready so CSS can safely pre-hide GSAP-animated elements.
    document.documentElement.classList.add("js-ready");

    document.addEventListener("DOMContentLoaded", function () {
        var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var scrollBehavior = prefersReducedMotion ? "auto" : "smooth";
        var navbar = document.getElementById("navbar");

        // ==================== BOOT SEQUENCE ====================
        var bootScreen = document.getElementById("boot-screen");
        var bootLog = document.getElementById("boot-log");

        function dismissBoot() {
            if (document.body.classList.contains("boot-complete")) return;
            if (bootScreen && !bootScreen.classList.contains("dismissed")) {
                bootScreen.classList.add("dismissed");
                setTimeout(function () { bootScreen.remove(); }, 500);
            }
            document.body.classList.add("boot-complete");
            document.dispatchEvent(new CustomEvent("boot-complete"));
        }

        // Ensure boot-complete fires even if no boot screen was rendered
        if (!bootScreen) {
            setTimeout(dismissBoot, 200);
        }

        if (bootScreen) {
            bootScreen.addEventListener("click", dismissBoot);
            document.addEventListener("keydown", function onAnyKey(e) {
                if (bootScreen && !bootScreen.classList.contains("dismissed")) {
                    dismissBoot();
                    document.removeEventListener("keydown", onAnyKey);
                }
            }, { once: false });
        }

        if (bootScreen && bootLog && !prefersReducedMotion) {
            var bootLines = [
                '<span class="dim">$</span> init agentic.console <span class="ac">v2.1.0</span>',
                '<span class="dim">&gt;</span> handshake <span class="dim">..........</span> <span class="ok">AUTH_OK</span>',
                '<span class="dim">&gt;</span> modules <span class="ac">[core, ui, telemetry, agents]</span> <span class="ok">LOADED</span>',
                '<span class="dim">&gt;</span> telemetry stream <span class="dim">...</span> <span class="ok">ONLINE</span>',
                '<span class="dim">&gt;</span> render_ui <span class="dim">........</span> <span class="ok">READY</span>',
                '<span class="dim">&gt;</span> welcome, operator. <span class="ac">[press</span> <span class="warn">/</span><span class="ac"> for command palette]</span>'
            ];

            var caretEl = document.createElement("span");
            caretEl.className = "caret";
            caretEl.innerHTML = "&nbsp;";

            bootLog.textContent = "";
            bootLog.appendChild(caretEl);

            var lineIdx = 0;
            function writeNextLine() {
                if (lineIdx >= bootLines.length) {
                    setTimeout(dismissBoot, 420);
                    return;
                }
                var lineWrap = document.createElement("span");
                lineWrap.innerHTML = bootLines[lineIdx];
                bootLog.insertBefore(lineWrap, caretEl);
                bootLog.insertBefore(document.createTextNode("\n"), caretEl);
                lineIdx++;
                setTimeout(writeNextLine, 180 + Math.random() * 120);
            }

            setTimeout(writeNextLine, 220);
        } else if (bootScreen) {
            // Reduced motion: flash boot briefly then dismiss.
            setTimeout(dismissBoot, 200);
        }

        // ==================== GSAP SCROLL ANIMATIONS ====================
        var gsapReady = !prefersReducedMotion && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

        if (gsapReady) {
            gsap.registerPlugin(ScrollTrigger);

            gsap.from(".hero-roles .role-tag", {
                opacity: 0, y: -30, duration: 0.6, stagger: 0.15, ease: "power3.out", delay: 0.2
            });
            gsap.from(".hero-name", {
                opacity: 0, scale: 0.8, duration: 1, ease: "power4.out", delay: 0.4
            });
            gsap.from(".hero-bottom", {
                opacity: 0, y: 30, duration: 0.8, ease: "power3.out", delay: 0.9
            });
            gsap.from(".operator-card", {
                scrollTrigger: { trigger: ".about-section", start: "top 85%", once: true },
                opacity: 0, x: -50, rotation: -4, duration: 0.9, ease: "power3.out"
            });
            /* Opacity-only stagger: avoid y/translate so cards stay on one baseline
               (y + stagger looked like a permanent staircase next to hover transforms). */
            gsap.from(".stat-item", {
                scrollTrigger: { trigger: ".about-right", start: "top 85%", once: true },
                opacity: 0, duration: 0.5, stagger: 0.1, ease: "power3.out"
            });
            gsap.from(".about-content", {
                scrollTrigger: { trigger: ".about-content", start: "top 90%", once: true },
                opacity: 0, y: 40, duration: 0.8, ease: "power3.out", delay: 0.2
            });
            gsap.from(".profile-card", {
                scrollTrigger: { trigger: ".about-cards", start: "top 92%", once: true },
                opacity: 0, duration: 0.5, stagger: 0.08, ease: "power3.out"
            });

            // Section chrome
            [".education-section", ".skills-section", ".experience-section", ".projects-section"].forEach(function (sel) {
                gsap.from(sel + " .section-tag-box", {
                    scrollTrigger: { trigger: sel, start: "top 85%", once: true },
                    opacity: 0, x: -30, duration: 0.5, ease: "power3.out"
                });
                gsap.from(sel + " .section-title-main, " + sel + " .section-title-accent", {
                    scrollTrigger: { trigger: sel + " .section-titles", start: "top 85%", once: true },
                    opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: "power3.out"
                });
            });

            // Window cards: stagger-reveal. Matches the CSS .js-ready pre-hide rules.
            // On completion we drop the inline transform and add `.revealed` so the
            // CSS hover-lift + tilt system (which uses its own transform) works cleanly.
            /* Education: editorial spread reveal */
            (function eduReveal() {
                var inner = document.querySelector(".edu-editorial-inner");
                if (!inner || typeof gsap.timeline !== "function") return;
                gsap.timeline({
                    scrollTrigger: { trigger: ".edu-editorial", start: "top 87%", once: true },
                    defaults: { ease: "power3.out" },
                    onComplete: function () {
                        inner.classList.add("revealed");
                        gsap.set(inner, { clearProps: "opacity,transform" });
                        gsap.set(".edu-mag-rail, .edu-mag-stories .edu-story", { clearProps: "opacity,transform" });
                    }
                })
                    .from(inner, { opacity: 0, y: 36, duration: 0.56 })
                    .from(".edu-mag-stories .edu-story", { opacity: 0, y: 26, stagger: 0.14, duration: 0.54 }, "-=0.28")
                    .from(".edu-mag-rail", { opacity: 0, x: 28, duration: 0.48 }, "-=0.42");
            })();
            /* Experience: operations log entries */
            gsap.from(".ops-entry", {
                scrollTrigger: { trigger: ".ops-stream", start: "top 88%", once: true },
                opacity: 0,
                y: 26,
                duration: 0.62,
                stagger: 0.11,
                ease: "power3.out",
                onComplete: function () {
                    this.targets().forEach(function (el) {
                        el.classList.add("revealed");
                        gsap.set(el, { clearProps: "opacity,transform" });
                    });
                }
            });

            gsap.from(".contact-title", {
                scrollTrigger: { trigger: ".contact-section", start: "top 85%", once: true },
                opacity: 0, y: 30, duration: 0.6, ease: "power3.out"
            });
            gsap.from(".contact-link", {
                scrollTrigger: { trigger: ".contact-links", start: "top 90%", once: true },
                opacity: 0, x: -30, duration: 0.5, stagger: 0.1, ease: "power3.out"
            });
            gsap.from(".contact-form", {
                scrollTrigger: { trigger: ".contact-form", start: "top 92%", once: true },
                opacity: 0, y: 30, duration: 0.6, ease: "power3.out"
            });
            gsap.from(".btn-contact", {
                scrollTrigger: { trigger: ".btn-contact", start: "top 95%", once: true },
                opacity: 0, scale: 0.8, duration: 0.5, ease: "back.out(1.7)"
            });
        } else {
            // No GSAP (or reduced motion): mark cards revealed so the CSS pre-hide is skipped.
            document.querySelectorAll(".ops-entry, .edu-editorial-inner").forEach(function (c) {
                c.classList.add("revealed");
            });
        }

        // Safety net: if GSAP loads but ScrollTrigger somehow misses a card, reveal it after 3s.
        setTimeout(function () {
            document.querySelectorAll(".ops-entry, .edu-editorial-inner").forEach(function (c) {
                var cs = window.getComputedStyle(c);
                if (parseFloat(cs.opacity) < 0.05) {
                    c.classList.add("revealed");
                    c.style.opacity = "";
                    c.style.transform = "";
                }
            });
        }, 3000);

        // ==================== WINDOW CARD CONTROLS ====================
        document.querySelectorAll(".window-card").forEach(function (card) {
            var dots = card.querySelectorAll(".window-dots .dot");

            dots.forEach(function (dot) {
                var action = dot.dataset.action || "action";
                dot.setAttribute("role", "button");
                dot.setAttribute("tabindex", "0");
                dot.setAttribute("aria-label", action + " card");

                dot.addEventListener("keydown", function (e) {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        dot.click();
                    }
                });

                dot.addEventListener("click", function (e) {
                    e.stopPropagation();
                    // If the card is currently closed, any dot click should restore it.
                    if (card.classList.contains("closed")) {
                        card.classList.remove("closed", "minimized", "expanded");
                        return;
                    }
                    if (action === "minimize") {
                        card.classList.toggle("minimized");
                        card.classList.remove("expanded", "closed");
                    } else if (action === "expand") {
                        card.classList.toggle("expanded");
                        card.classList.remove("minimized", "closed");
                    } else if (action === "close") {
                        card.classList.add("closed");
                        card.classList.remove("expanded", "minimized");
                    }
                });
            });
        });

        // ==================== MOBILE MENU ====================
        var mobileMenuBtn = document.getElementById("mobile-menu-btn");
        var mobileMenu = document.getElementById("mobile-menu");

        function setMobileMenu(open) {
            if (!mobileMenu || !mobileMenuBtn) return;
            mobileMenu.classList.toggle("active", open);
            mobileMenuBtn.setAttribute("aria-expanded", String(open));
            mobileMenu.setAttribute("aria-hidden", String(!open));
            document.body.style.overflow = open ? "hidden" : "";
            if (open) {
                var firstLink = mobileMenu.querySelector("a");
                if (firstLink) firstLink.focus();
            }
        }

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener("click", function () {
                setMobileMenu(!mobileMenu.classList.contains("active"));
            });

            mobileMenu.querySelectorAll("a").forEach(function (link) {
                link.addEventListener("click", function () { setMobileMenu(false); });
            });

            document.addEventListener("click", function (e) {
                if (!mobileMenu.classList.contains("active")) return;
                if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    setMobileMenu(false);
                }
            });

            document.addEventListener("keydown", function (e) {
                if (e.key === "Escape" && mobileMenu.classList.contains("active")) setMobileMenu(false);
            });
        }

        // ==================== SMOOTH SCROLLING ====================
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener("click", function (e) {
                var href = this.getAttribute("href");
                if (href === "#" || href.length < 2) return;
                var target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 70, behavior: scrollBehavior });
            });
        });

        // ==================== ACTIVE NAV (IntersectionObserver) ====================
        var navSections = document.querySelectorAll("section[id]");
        var navLinks = document.querySelectorAll(".nav-links a");

        if ("IntersectionObserver" in window && navSections.length) {
            var navObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var id = entry.target.getAttribute("id");
                    navLinks.forEach(function (link) {
                        link.classList.toggle("active", link.getAttribute("href") === "#" + id);
                    });
                });
            }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

            navSections.forEach(function (s) { navObserver.observe(s); });
        }

        // ==================== NAVBAR + SCROLL-TO-TOP (rAF-throttled) ====================
        var scrollToTopBtn = document.getElementById("scrollToTop");
        var scrollTicking = false;

        function onScrollFrame() {
            var y = window.scrollY;
            if (navbar) {
                if (y > 50) {
                    navbar.style.background = "rgba(4, 10, 20, 0.95)";
                    navbar.style.boxShadow = "0 2px 20px rgba(57, 210, 255, 0.16)";
                } else {
                    navbar.style.background = "rgba(7, 11, 20, 0.86)";
                    navbar.style.boxShadow = "none";
                }
            }
            if (scrollToTopBtn) {
                scrollToTopBtn.classList.toggle("visible", y > 350);
            }
            if (!prefersReducedMotion) {
                var heroName = document.querySelector(".hero-name");
                if (heroName && y < window.innerHeight) {
                    heroName.style.transform = "translateY(" + (y * 0.15) + "px)";
                }
            }
            scrollTicking = false;
        }

        window.addEventListener("scroll", function () {
            if (scrollTicking) return;
            scrollTicking = true;
            window.requestAnimationFrame(onScrollFrame);
        }, { passive: true });
        onScrollFrame();

        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener("click", function () {
                window.scrollTo({ top: 0, behavior: scrollBehavior });
            });
        }

        // ==================== ROLE TAGS ====================
        document.querySelectorAll(".role-tag").forEach(function (tag) {
            tag.setAttribute("tabindex", "0");
            tag.setAttribute("role", "button");
            tag.addEventListener("click", function () {
                document.querySelectorAll(".role-tag").forEach(function (t) { t.classList.remove("active"); });
                this.classList.add("active");
            });
            tag.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // ==================== OPERATOR CARD TILT ====================
        var operatorCard = document.querySelector(".operator-card");
        if (operatorCard && !prefersReducedMotion) {
            var opTiltFrame = null;
            operatorCard.addEventListener("mousemove", function (e) {
                var rect = this.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                var self = this;
                cancelAnimationFrame(opTiltFrame);
                opTiltFrame = requestAnimationFrame(function () {
                    self.style.transform =
                        "perspective(900px) rotateY(" + (x * 8) + "deg) rotateX(" + (-y * 8) + "deg) translateZ(0)";
                });
            });
            operatorCard.addEventListener("mouseleave", function () {
                cancelAnimationFrame(opTiltFrame);
                this.style.transform = "";
            });
        }

        // ==================== STATS COUNTER ====================
        // Reads numeric target from data-count, supports decimals + zero-padding,
        // and leaves any suffix as a separate sibling element.
        var statsBar = document.querySelector(".stats-bar");
        if (statsBar && "IntersectionObserver" in window) {
            var formatStat = function (value, decimals, pad) {
                var s;
                if (decimals > 0) {
                    s = value.toFixed(decimals);
                } else {
                    s = String(Math.floor(value));
                }
                if (pad > 0) {
                    var parts = s.split(".");
                    while (parts[0].length < pad) parts[0] = "0" + parts[0];
                    s = parts.join(".");
                }
                return s;
            };

            var statsObserver = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    obs.disconnect();
                    document.querySelectorAll(".stat-number").forEach(function (stat) {
                        var target = parseFloat(stat.dataset.count);
                        if (isNaN(target)) {
                            target = parseFloat(stat.textContent);
                        }
                        if (isNaN(target)) return;
                        var decimals = parseInt(stat.dataset.decimals || "0", 10);
                        var pad      = parseInt(stat.dataset.pad      || "0", 10);

                        if (prefersReducedMotion) {
                            stat.textContent = formatStat(target, decimals, pad);
                            return;
                        }
                        var current = 0;
                        var step = target / 40;
                        var timer = setInterval(function () {
                            current += step;
                            if (current >= target) {
                                stat.textContent = formatStat(target, decimals, pad);
                                clearInterval(timer);
                            } else {
                                stat.textContent = formatStat(current, decimals, pad);
                            }
                        }, 30);
                    });
                });
            }, { threshold: 0.5 });
            statsObserver.observe(statsBar);
        }

        // ==================== MISSION TIMELINE (scrollytelling) ====================
        var missionScenes = document.querySelectorAll(".mission-scene");
        var missionIdxItems = document.querySelectorAll(".idx-item");
        var missionProgressFill = document.getElementById("mission-progress-fill");
        var missionProgressCurrent = document.getElementById("mission-progress-current");
        var missionProgressTotal = document.getElementById("mission-progress-total");

        function animateCountUp(el) {
            if (!el || el.dataset.counted === "true") return;
            el.dataset.counted = "true";
            var target = parseFloat(el.getAttribute("data-count") || "0");
            var suffix = el.getAttribute("data-suffix") || "";
            if (!isFinite(target) || target <= 0) { el.textContent = target + suffix; return; }
            if (prefersReducedMotion) {
                el.textContent = formatMetric(target) + suffix;
                return;
            }
            var duration = 1100;
            var startTs = null;
            function step(ts) {
                if (!startTs) startTs = ts;
                var p = Math.min(1, (ts - startTs) / duration);
                var eased = 1 - Math.pow(1 - p, 3);
                var value = Math.floor(target * eased);
                el.textContent = formatMetric(value) + suffix;
                if (p < 1) requestAnimationFrame(step);
                else el.textContent = formatMetric(target) + suffix;
            }
            requestAnimationFrame(step);
        }

        function formatMetric(n) {
            if (n >= 1000) return n.toLocaleString("en-US");
            return String(n);
        }

        function setActiveMission(missionId) {
            if (!missionId) return;
            missionIdxItems.forEach(function (item) {
                var isActive = item.getAttribute("data-target") === missionId;
                item.classList.toggle("active", isActive);
            });
            var match = /mission-(\d+)/.exec(missionId);
            if (match && missionProgressCurrent) missionProgressCurrent.textContent = match[1];
            if (match && missionProgressFill) {
                var idx = parseInt(match[1], 10);
                var total = missionScenes.length || 1;
                var pct = Math.max(0, Math.min(100, (idx / total) * 100));
                missionProgressFill.style.width = pct + "%";
            }
        }

        if (missionProgressTotal && missionScenes.length) {
            missionProgressTotal.textContent = String(missionScenes.length);
        }

        if (missionScenes.length && "IntersectionObserver" in window) {
            var sceneObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    var scene = entry.target;
                    if (entry.isIntersecting) {
                        scene.classList.add("in-view");

                        var titleEl = scene.querySelector(".mission-title[data-scramble-target]");
                        if (titleEl && !prefersReducedMotion && titleEl.dataset.scrambled !== "done" && titleEl.dataset.scrambled !== "true") {
                            scrambleText(titleEl, titleEl.getAttribute("data-scramble-target") || titleEl.textContent);
                        }

                        var metric = scene.querySelector(".mission-metric");
                        if (metric) animateCountUp(metric);
                    }
                });
            }, { threshold: 0.35 });
            missionScenes.forEach(function (s) { sceneObserver.observe(s); });

            // Active-state tracker: which mission is most centered in the viewport.
            var activeObserver = new IntersectionObserver(function (entries) {
                var best = null;
                var bestRatio = 0;
                entries.forEach(function (entry) {
                    if (entry.intersectionRatio > bestRatio) {
                        best = entry.target;
                        bestRatio = entry.intersectionRatio;
                    }
                });
                // Fallback: pick the scene whose top is closest to viewport mid.
                if (!best) {
                    var mid = window.innerHeight / 2;
                    var closest = null;
                    var closestDist = Infinity;
                    missionScenes.forEach(function (s) {
                        var r = s.getBoundingClientRect();
                        var center = r.top + r.height / 2;
                        var d = Math.abs(center - mid);
                        if (d < closestDist) { closestDist = d; closest = s; }
                    });
                    best = closest;
                }
                if (best) setActiveMission(best.id);
            }, {
                threshold: [0.1, 0.25, 0.5, 0.75],
                rootMargin: "-35% 0px -35% 0px"
            });
            missionScenes.forEach(function (s) { activeObserver.observe(s); });
        } else if (missionScenes.length) {
            // Fallback: mark all scenes in-view, skip scroll tracking.
            missionScenes.forEach(function (s) { s.classList.add("in-view"); });
        }

        // Timeline click → smooth scroll to that mission
        missionIdxItems.forEach(function (item) {
            item.addEventListener("click", function () {
                var targetId = item.getAttribute("data-target");
                var target = targetId && document.getElementById(targetId);
                if (!target) return;
                var navbarEl = document.getElementById("navbar");
                var offset = (navbarEl ? navbarEl.offsetHeight : 70) + 16;
                var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: y, behavior: scrollBehavior });
            });
            item.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    item.click();
                }
            });
            item.setAttribute("tabindex", "0");
            item.setAttribute("role", "link");
        });

        // Initialize first active state if none set yet (e.g. landing directly on projects).
        if (missionIdxItems.length && !document.querySelector(".idx-item.active")) {
            setActiveMission("mission-01");
        }

        // ==================== OPERATIONS LOG (sidebar ↔ entries) ====================
        var opsEntries = document.querySelectorAll(".ops-entry");
        var opsIdxItems = document.querySelectorAll(".ops-idx-item");

        function setActiveOps(entryId) {
            if (!entryId) return;
            opsIdxItems.forEach(function (item) {
                item.classList.toggle("active", item.getAttribute("data-target") === entryId);
            });
        }

        if (opsEntries.length && "IntersectionObserver" in window) {
            var opsActiveObserver = new IntersectionObserver(function (entries) {
                var best = null;
                var bestRatio = 0;
                entries.forEach(function (entry) {
                    if (entry.intersectionRatio > bestRatio) {
                        best = entry.target;
                        bestRatio = entry.intersectionRatio;
                    }
                });
                if (!best) {
                    var mid = window.innerHeight / 2;
                    var closest = null;
                    var closestDist = Infinity;
                    opsEntries.forEach(function (el) {
                        var r = el.getBoundingClientRect();
                        var c = r.top + r.height / 2;
                        var d = Math.abs(c - mid);
                        if (d < closestDist) {
                            closestDist = d;
                            closest = el;
                        }
                    });
                    best = closest;
                }
                if (best && best.id) setActiveOps(best.id);
            }, {
                threshold: [0.12, 0.28, 0.48, 0.72],
                rootMargin: "-30% 0px -30% 0px"
            });
            opsEntries.forEach(function (el) { opsActiveObserver.observe(el); });
        }

        opsIdxItems.forEach(function (item) {
            item.addEventListener("click", function () {
                var targetId = item.getAttribute("data-target");
                var target = targetId && document.getElementById(targetId);
                if (!target) return;
                var navbarEl = document.getElementById("navbar");
                var offset = (navbarEl ? navbarEl.offsetHeight : 70) + 16;
                var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: y, behavior: scrollBehavior });
                setActiveOps(targetId);
            });
            item.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    item.click();
                }
            });
        });

        // ==================== CAPABILITY METERS ====================
        var meters = document.querySelectorAll(".capability-meter");
        if (meters.length && "IntersectionObserver" in window) {
            var meterObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var m = entry.target;
                    var val = m.getAttribute("data-value") || "0%";
                    m.style.setProperty("--value", val);
                    m.classList.add("in-view");
                    meterObserver.unobserve(m);
                });
            }, { threshold: 0.4 });
            meters.forEach(function (m) { meterObserver.observe(m); });
        }

        // ==================== QUOTE TYPEWRITER ====================
        var quoteEl = document.querySelector(".quote-text");
        if (quoteEl && !prefersReducedMotion) {
            var originalHTML = quoteEl.innerHTML;
            var plainWithBreaks = originalHTML
                .replace(/<br\s*\/?>(\s*)/gi, "\n")
                .replace(/<[^>]+>/g, "");
            quoteEl.textContent = "";
            quoteEl.style.whiteSpace = "pre-line";
            quoteEl.classList.add("typing");
            var i = 0;
            var typer = setInterval(function () {
                if (i >= plainWithBreaks.length) {
                    clearInterval(typer);
                    quoteEl.style.whiteSpace = "";
                    quoteEl.innerHTML = originalHTML;
                    quoteEl.classList.remove("typing");
                    return;
                }
                quoteEl.textContent = plainWithBreaks.slice(0, ++i);
            }, 22);
        }

        // ==================== WINDOW CARD TILT (CSS vars; no conflict with hover) ====================
        if (!prefersReducedMotion) {
            document.querySelectorAll(".window-card").forEach(function (card) {
                card.addEventListener("mousemove", function (e) {
                    var rect = this.getBoundingClientRect();
                    var x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
                    var y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
                    this.style.setProperty("--tilt-x", x.toFixed(2) + "deg");
                    this.style.setProperty("--tilt-y", y.toFixed(2) + "deg");
                    this.classList.add("tilting");
                });
                card.addEventListener("mouseleave", function () {
                    this.style.setProperty("--tilt-x", "0deg");
                    this.style.setProperty("--tilt-y", "0deg");
                    this.classList.remove("tilting");
                });
            });
        }

        // ==================== CONTACT FORM ====================
        var contactForm = document.getElementById("contact-form");
        if (contactForm) {
            var statusEl = document.getElementById("form-status");

            function setFieldError(id, msg) {
                var group = document.getElementById(id);
                if (!group) return;
                var wrap = group.closest(".form-group");
                var errEl = document.getElementById(id + "-error");
                if (msg) {
                    wrap.classList.add("invalid");
                    if (errEl) errEl.textContent = msg;
                } else {
                    wrap.classList.remove("invalid");
                    if (errEl) errEl.textContent = "";
                }
            }

            ["name", "email", "message"].forEach(function (id) {
                var el = document.getElementById(id);
                if (el) el.addEventListener("input", function () { setFieldError(id, ""); });
            });

            function showStatus(type, text) {
                if (!statusEl) return;
                statusEl.className = "form-status visible " + type;
                statusEl.textContent = text;
            }

            contactForm.addEventListener("submit", function (e) {
                e.preventDefault();

                var name = (document.getElementById("name") || {}).value || "";
                var email = (document.getElementById("email") || {}).value || "";
                var message = (document.getElementById("message") || {}).value || "";
                var honeypot = (document.getElementById("website") || {}).value || "";

                // Silently accept bots but don't actually send.
                if (honeypot) {
                    showStatus("success", "Message queued.");
                    return;
                }

                var valid = true;
                if (!name.trim()) { setFieldError("name", "Name is required."); valid = false; }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
                    setFieldError("email", "Please enter a valid email.");
                    valid = false;
                }
                if (!message.trim() || message.trim().length < 10) {
                    setFieldError("message", "Message should be at least 10 characters.");
                    valid = false;
                }

                if (!valid) {
                    showStatus("error", "Please fix the highlighted fields and try again.");
                    return;
                }

                var subject = encodeURIComponent("Portfolio Inquiry from " + name.trim());
                var body = encodeURIComponent(
                    "Name: " + name.trim() + "\n" +
                    "Email: " + email.trim() + "\n\n" +
                    message.trim()
                );

                showStatus("success", "Opening your email client with the message ready to send...");
                window.location.href = "mailto:rohankeshavh@gmail.com?subject=" + subject + "&body=" + body;
            });
        }

        // ==================== COMMAND PALETTE ====================
        var cmdPalette = document.getElementById("cmd-palette");
        var cmdTrigger = document.getElementById("cmd-trigger");
        var cmdInput = document.getElementById("cmd-input");
        var cmdList = document.getElementById("cmd-list");
        var cmdItems = cmdList ? Array.prototype.slice.call(cmdList.querySelectorAll("li")) : [];
        var lastFocused = null;

        function openPalette() {
            if (!cmdPalette) return;
            lastFocused = document.activeElement;
            cmdPalette.hidden = false;
            document.body.style.overflow = "hidden";
            if (cmdInput) {
                cmdInput.value = "";
                filterPalette("");
                cmdInput.focus();
            }
            setActiveItem(0);
        }

        function closePalette() {
            if (!cmdPalette) return;
            cmdPalette.hidden = true;
            document.body.style.overflow = "";
            if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
        }

        function filterPalette(q) {
            q = (q || "").trim().toLowerCase();
            var firstVisible = -1;
            cmdItems.forEach(function (li, i) {
                var text = li.textContent.toLowerCase();
                var match = !q || text.indexOf(q) !== -1;
                li.hidden = !match;
                if (match && firstVisible === -1) firstVisible = i;
            });
            setActiveItem(firstVisible >= 0 ? firstVisible : 0);
        }

        function setActiveItem(index) {
            cmdItems.forEach(function (li) { li.classList.remove("active"); });
            var target = cmdItems[index];
            if (target && !target.hidden) {
                target.classList.add("active");
                target.scrollIntoView({ block: "nearest" });
            }
        }

        function moveActive(delta) {
            var visible = cmdItems.filter(function (li) { return !li.hidden; });
            if (!visible.length) return;
            var currentIndex = visible.findIndex(function (li) { return li.classList.contains("active"); });
            var nextIndex = (currentIndex + delta + visible.length) % visible.length;
            setActiveItem(cmdItems.indexOf(visible[nextIndex]));
        }

        function executeActive() {
            var active = cmdList && cmdList.querySelector("li.active");
            if (!active) return;
            var target = active.getAttribute("data-target");
            var action = active.getAttribute("data-action");
            closePalette();
            if (!target) return;
            if (action === "github" || action === "linkedin") {
                window.open(target, "_blank", "noopener,noreferrer");
            } else if (action === "resume") {
                window.open(target, "_blank", "noopener,noreferrer");
            } else if (target.indexOf("#") === 0) {
                var el = document.querySelector(target);
                if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: scrollBehavior });
            }
        }

        if (cmdTrigger) cmdTrigger.addEventListener("click", openPalette);
        if (cmdInput) cmdInput.addEventListener("input", function (e) { filterPalette(e.target.value); });
        if (cmdList) {
            cmdList.addEventListener("click", function (e) {
                var li = e.target.closest("li");
                if (!li) return;
                cmdItems.forEach(function (item) { item.classList.remove("active"); });
                li.classList.add("active");
                executeActive();
            });
        }
        if (cmdPalette) {
            cmdPalette.addEventListener("click", function (e) {
                if (e.target === cmdPalette) closePalette();
            });
        }

        document.addEventListener("keydown", function (e) {
            var isMeta = e.ctrlKey || e.metaKey;
            if (isMeta && e.key.toLowerCase() === "k") {
                e.preventDefault();
                if (cmdPalette && !cmdPalette.hidden) closePalette(); else openPalette();
                return;
            }
            // "/" to open when not already typing in an input.
            if (e.key === "/" && cmdPalette && cmdPalette.hidden) {
                var tag = (e.target && e.target.tagName) || "";
                if (tag !== "INPUT" && tag !== "TEXTAREA") {
                    e.preventDefault();
                    openPalette();
                    return;
                }
            }
            if (!cmdPalette || cmdPalette.hidden) return;
            if (e.key === "Escape") { e.preventDefault(); closePalette(); }
            else if (e.key === "ArrowDown") { e.preventDefault(); moveActive(1); }
            else if (e.key === "ArrowUp") { e.preventDefault(); moveActive(-1); }
            else if (e.key === "Enter") { e.preventDefault(); executeActive(); }
        });

        // ==================== TEXT SCRAMBLE ====================
        var scrambleChars = "!<>-_\\/[]{}—=+*^?#";
        function scrambleText(el, finalText) {
            if (!el) return;
            if (el.dataset.scrambled === "true") return;
            el.dataset.scrambled = "true";

            var oldText = el.textContent;
            var target = finalText || oldText;
            var length = Math.max(oldText.length, target.length);
            var queue = [];
            for (var i = 0; i < length; i++) {
                var from = oldText[i] || "";
                var to = target[i] || "";
                var start = Math.floor(Math.random() * 70);
                var end = start + 40 + Math.floor(Math.random() * 70);
                queue.push({ from: from, to: to, start: start, end: end, char: "" });
            }

            var frame = 0;

            function update() {
                var output = "";
                var complete = 0;
                for (var i = 0; i < queue.length; i++) {
                    var q = queue[i];
                    if (frame >= q.end) {
                        complete++;
                        output += q.to;
                    } else if (frame >= q.start) {
                        if (!q.char || Math.random() < 0.18) {
                            q.char = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                        }
                        output += '<span class="scramble-char">' + q.char + '</span>';
                    } else {
                        output += q.from;
                    }
                }
                el.innerHTML = output;
                if (complete === queue.length) {
                    el.textContent = target;
                    el.dataset.scrambled = "done";
                    return;
                }
                frame++;
                requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
        }

        if (!prefersReducedMotion && "IntersectionObserver" in window) {
            var titleEls = document.querySelectorAll(".section-title-main, .section-title-accent");
            var titleObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    scrambleText(entry.target, entry.target.textContent);
                    titleObserver.unobserve(entry.target);
                });
            }, { threshold: 0.45 });
            titleEls.forEach(function (el) { titleObserver.observe(el); });

            // Hero name: scramble on hover, with a cooldown so repeated hovers don't spam.
            var heroNameEl = document.querySelector(".hero-name");
            if (heroNameEl) {
                var heroCooldown = false;
                heroNameEl.addEventListener("mouseenter", function () {
                    if (heroCooldown) return;
                    heroCooldown = true;
                    heroNameEl.dataset.scrambled = "";
                    scrambleText(heroNameEl, heroNameEl.textContent || "ROHAN");
                    setTimeout(function () { heroCooldown = false; }, 2500);
                });
            }
        }

        // ==================== KONAMI / GHOST PROTOCOL ====================
        var konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
        var konamiIndex = 0;
        var ghostTimer = null;
        var toastTimer = null;
        var toastEl = document.getElementById("achievement-toast");
        var toastDescEl = document.getElementById("achievement-desc");

        function showAchievement(title, desc) {
            if (!toastEl) return;
            if (toastDescEl && desc) toastDescEl.textContent = desc;
            toastEl.hidden = false;
            requestAnimationFrame(function () { toastEl.classList.add("visible"); });
            clearTimeout(toastTimer);
            toastTimer = setTimeout(function () {
                toastEl.classList.remove("visible");
                setTimeout(function () { toastEl.hidden = true; }, 450);
            }, 3800);
        }

        function triggerGhostProtocol() {
            document.body.classList.add("ghost-protocol");
            showAchievement("ACHIEVEMENT UNLOCKED", "Ghost Protocol");
            try {
                console.log("%c  >> GHOST_PROTOCOL ENGAGED  ", "background:#A78BFA;color:#0B162A;padding:6px 12px;font-weight:700;letter-spacing:0.15em;border-radius:4px;");
            } catch (_) { /* noop */ }
            clearTimeout(ghostTimer);
            ghostTimer = setTimeout(function () {
                document.body.classList.remove("ghost-protocol");
            }, 9000);
        }

        if (toastEl) {
            toastEl.addEventListener("click", function () {
                toastEl.classList.remove("visible");
                setTimeout(function () { toastEl.hidden = true; }, 450);
            });
        }

        document.addEventListener("keydown", function (e) {
            // Skip konami detection while typing in inputs or while command palette is open.
            var tag = (e.target && e.target.tagName) || "";
            if (tag === "INPUT" || tag === "TEXTAREA") { konamiIndex = 0; return; }
            if (cmdPalette && !cmdPalette.hidden) { konamiIndex = 0; return; }

            var expected = konami[konamiIndex];
            var key = e.key;
            // Normalize so "B"/"b" both match the final b/a keys.
            if (expected === "b" || expected === "a") {
                if (key.toLowerCase() === expected) konamiIndex++;
                else konamiIndex = 0;
            } else if (key === expected) {
                konamiIndex++;
            } else {
                konamiIndex = 0;
            }

            if (konamiIndex === konami.length) {
                konamiIndex = 0;
                triggerGhostProtocol();
            }
        });
    });
})();
