# Pricing Section — Implementation Specification

## Objective

Add a complete **Pricing section/page** to the existing website.

The website already exists, so **DO NOT redesign, rebuild, or replace the existing website**.

The goal is only to add the new pricing experience and connect it naturally with the existing website.

Keep the existing:

* Design system
* Colors
* Typography
* Animations
* Navbar
* Hero section
* Portfolio / Works section
* Existing sections
* Existing responsive behavior
* Existing components and architecture

Reuse the existing design language and components whenever possible.

---

# 1. Navbar

Add a new **Pricing** item to the existing navbar.

Do not remove or modify existing navbar items.

The Pricing navbar item should scroll/navigate to the Pricing section/page depending on the current website architecture.

---

# 2. Pricing Section

Create a professional, modern pricing section focused on **value and outcomes**, not just technical services.

The user is a freelancer/software developer offering custom AI and web solutions.

There are 4 offers:

1. Voice AI Agent
2. AI Chatbot
3. Custom Web Application
4. Complete AI Business Solution

Do NOT make the prices look like fixed packages.

Every price must clearly say:

**Starting from**

The final price depends on the client's requirements.

Use this exact pricing disclaimer:

> These are starting prices, not fixed project prices. Final pricing depends on your requirements, project scope, integrations, and complexity.

---

# 3. Currency

The base pricing is in USD.

The website should support displaying approximate prices in different currencies.

Supported currencies should include at least:

* USD ($)
* EUR (€)
* GBP (£)
* SAR (﷼)
* CNY (¥)
* RUB (₽)

The user accepts different payment currencies.

Add a currency selector near the pricing section.

Example:

USD ▼

When the user changes currency, display the approximate converted starting price.

Important:

The converted amount is only an approximate display.

Do NOT imply that the converted value is the final contractual price.

Add a small note:

> Prices in other currencies are approximate conversions. Final project pricing is agreed upon based on the selected payment currency and project requirements.

USD should remain the base/reference currency.

If a real-time exchange-rate API is not already available in the project, do not add an unnecessary external dependency just for this feature. Use a clean fallback/static conversion approach or the project's existing currency mechanism.

---

# 4. Offer 1 — Voice AI Agent

## Name

**Voice AI Agent**

## Price

**Starting from $1,000**

## Timeline

**Typical timeline: 2–4+ weeks**

The "+" is important because some projects may take longer depending on complexity.

Use wording such as:

> Typical timeline: 2–4+ weeks, depending on project requirements.

## Main value statement

Use outcome-focused copy rather than only technical terminology.

Suggested headline:

> **Turn missed calls into handled conversations.**

Suggested description:

> Build an AI voice agent that can communicate with your customers, answer questions, qualify leads, book appointments, and handle custom business tasks.

## Benefits

Show concise benefits on the front of the pricing card:

* Answer customer questions
* Book appointments
* Qualify leads
* Customer support
* Custom functions based on your business needs

Do not claim that every integration is automatically included.

CRM integrations can be discussed during the discovery process because some CRM platforms may restrict external services or require specific access/configuration from the client's side.

## Detailed card content

When the user clicks the card, reveal the detailed information using the existing site's interaction style.

Explain that the final solution is customized after a meeting.

Mention that the client can be shown how to manage/change the AI prompt and functions after the system is built.

Do not make unsupported promises about specific third-party platforms.

---

# 5. Offer 2 — AI Chatbot

## Name

**AI Chatbot**

## Price

**Starting from $600**

## Timeline

**Typical timeline: 2–4+ weeks**

The timeline can be longer depending on project complexity.

## Supported channels

The chatbot can be built for:

* Website
* WhatsApp

## Main value statement

Suggested headline:

> **Turn your website or WhatsApp into a 24/7 AI assistant.**

Suggested description:

> Custom AI chatbots designed to answer customer questions, support your customers, qualify leads, and handle the tasks your business needs.

## Benefits

Show on the front of the card:

* Website AI chatbot
* WhatsApp AI chatbot
* Answer customer questions
* Lead qualification
* Customer support
* Custom functionality based on your requirements

The detailed view should explain that the exact functionality depends on the project.

The client can also be shown how to manage/change the AI prompt and available functions after delivery.

---

# 6. Offer 3 — Custom Web Application

## Name

**Custom Web Application**

Do NOT call this simply "Website".

This service is for custom web applications and business systems.

## Price

**Starting from $3,000**

## Timeline

**Starting from 3+ weeks**

The final timeline depends on the project's scope and complexity.

## Main value statement

Suggested headline:

> **Turn your business process into a custom application built around the way you work.**

## Examples of possible projects

Do not imply that all of these are automatically included.

Examples can include:

* SaaS platforms
* Business dashboards
* Management systems
* Customer portals
* Internal tools
* Booking systems
* Custom business platforms
* API-based applications
* Other custom web applications

## Current platform

The current primary offering is **Web Applications**.

Mobile applications are not currently a primary advertised service.

If a client requests a mobile application, it may be discussed separately as a custom project.

Currently, mobile publishing is not included as a standard service.

Do not advertise App Store publishing.

---

# 7. Offer 4 — Complete AI Business Solution

## Name

**Complete AI Business Solution**

This is the combined offer.

## Price

**Starting from $4,000**

This is a starting price, not a fixed package price.

## Timeline

Do not give a fixed timeline for this package.

Use:

> **Timeline: Based on project scope**

## Main value statement

Use a strong outcome-focused statement:

> **Everything you need to automate, engage, and convert more customers — in one complete solution.**

This offer combines the three primary services:

* Voice AI Agent
* AI Chatbot
* Custom Web Application

The final scope is defined after the discovery meeting.

Do not imply that every possible feature is included for $4,000.

Clearly state that the final price and scope depend on:

* Requirements
* Features
* Integrations
* Complexity
* Project size

---

# 8. Pricing Card Interaction

The pricing cards should be visually attractive and interactive.

The preferred interaction is:

### Front of card

Show:

* Service name
* Main value/outcome
* Short description
* 3–5 key benefits
* Starting price
* Timeline
* A visual indication that the card can be clicked

Add text such as:

> **Click to see more details**

Use an arrow/icon if appropriate.

### Back of card / expanded state

When clicked, reveal:

* More detailed description
* What is included
* Typical use cases
* Important limitations/notes
* Timeline
* Payment information where appropriate
* CTA

The animation should be smooth and professional.

Do not make the interaction confusing on mobile.

On mobile, if a flip card is technically awkward, use an expandable/accordion-style card while preserving the same visual concept.

---

# 9. CTA

The primary CTA should NOT say:

> Buy Now

These are custom projects, not fixed products.

Use:

> **Discuss Your Project**

or:

> **Let's Discuss Your Project**

The CTA should lead to the existing contact mechanism/page.

---

# 10. WhatsApp Contact CTA

After the pricing cards, add a clear section:

> **Have questions?**

Subtext:

> Let's talk about your project and find the right solution for your business.

Add a button:

> **Contact Me on WhatsApp**

The button should open WhatsApp using the existing configured WhatsApp contact number if one already exists in the project.

Do not invent a WhatsApp number.

If the number is stored in an existing configuration/environment variable, reuse it.

If there is no existing number, leave a clear TODO/configuration placeholder rather than inventing one.

---

# 11. FAQ Section

Immediately after the WhatsApp CTA, add:

# FAQ

The FAQ should use **accordion items**.

Each question has a downward arrow:

> Question  <

When clicked, the answer expands below it.

When closed, only the question and arrow are visible.

Use smooth animation.

The FAQ should include the following questions.

---

## FAQ 1 — What are the steps?

Question:

> **What are the steps?**

Answer should explain:

### 1. Discovery & Planning

We start with a meeting to understand the business, goals, requirements, desired features, and project scope.

### 2. Requirements & Planning

We organize the requirements and determine what needs to be built.

### 3. Prototype

A prototype/initial version is prepared based on the agreed direction.

The client can review the prototype before development continues.

### 4. Development

The application is developed and refined according to the agreed requirements.

### 5. Testing & Review

The developer tests the application first.

After internal testing, the client/team receives the application for review and testing.

The standard client testing/review period is **3 days**.

For larger applications, a review period of up to **7 days** may be agreed upon depending on the project.

This client review period is separate from the development timeline.

### 6. Delivery & Support

After the project is completed and the final payment is made, the project is delivered.

There is a **7-day Review & Adjustment period** for issues and adjustments related to the originally agreed project scope.

---

# 12. Payment FAQ

Question:

> **How does payment work?**

Answer:

> A 20% upfront payment is required to start the project.

The remaining 80% is not necessarily paid in one single payment.

After the initial meeting, the payment schedule can be divided into milestones depending on the size and structure of the project.

Example:

> 20% upfront → Prototype milestone → Development milestones → Final payment

The exact milestone structure is agreed upon before or during the project.

Do not promise a fixed milestone structure for every project.

---

# 13. Refund / Cancellation FAQ

Question:

> **What is the refund policy?**

Use a clear and fair explanation.

### Upfront payment

The 20% upfront payment is **non-refundable** because it covers project initiation, planning, meetings, requirements analysis, and the beginning of development.

### Client cancellation

If the client decides to stop the project during development:

* The project can be stopped.
* The 20% upfront payment is not refunded.
* The client is responsible for completed and agreed milestones/work already performed.
* The client does NOT automatically owe the remaining 80% simply because the original project price was agreed upon.
* Any unpaid completed milestone becomes due according to the agreed milestone plan.

The contract should clearly define milestone payment obligations.

### Developer/project failure

If the developer is unable to deliver the agreed project because of a failure on the developer's side, and the project cannot reasonably be completed as agreed:

> The client may receive a full refund of payments made for the project.

Do not use vague language such as "if the client doesn't like the project, they get a refund."

The refund policy applies to genuine project failure, not subjective preference.

---

# 14. Review & Adjustment FAQ

Question:

> **What happens after the project is finished?**

Answer:

After development and client testing, the project enters a **7-day Review & Adjustment period**.

During this period, the client can report:

* Bugs
* Issues
* Problems with agreed functionality
* Minor adjustments related to the original agreed scope

These adjustments are included.

### New features are different.

If the client requests a new feature that was not part of the original agreed scope, it is treated as new work.

Example:

> Original project: AI chatbot with customer support.

After completion:

> "I also want a full CRM system."

That is a new feature/project.

New features and new requirements will be discussed separately and handled under a **new agreement/contract**.

The original project must be completed first.

---

# 15. Source Code FAQ

Question:

> **Will I receive the source code?**

Answer:

After the final payment, the client receives the source code and project files required to operate and maintain their customized application.

The developer's pre-existing reusable materials are not transferred as separate assets.

This includes things such as:

* Pre-existing templates
* Reusable components
* Internal development tools
* Pre-existing libraries created by the developer
* General-purpose systems or components created before the client's project

The client receives the customized project they paid to have developed.

Do not charge an additional source-code fee by default.

The source code handover should not be presented as an extra paid feature in the pricing cards.

---

# 16. Base Template / Reusable Technology

The developer uses pre-built templates and reusable components to accelerate development.

For example:

A Voice AI base template may already contain:

* Voice AI logic
* Dashboard
* Prompt management
* Functions/tools
* Authentication
* Common integrations
* UI components

For each client, the developer creates a customized version by changing branding, colors, logo, prompts, functionality, and other client-specific requirements.

The client's customized application is delivered to them.

However, the developer retains ownership of pre-existing templates, reusable components, tools, and general-purpose technology used to build multiple projects.

This should be presented professionally and should NOT make the client feel that they are receiving an incomplete application.

The client receives the complete application they paid for.

---

# 17. Reselling / White-label FAQ

Question:

> **Can I resell or white-label the solution?**

Answer:

> Reselling or white-labeling the solution to other businesses is not automatically included in the standard project agreement.

If a client wants to commercialize, resell, license, or offer the solution to other businesses under their own brand, this can be discussed separately.

A separate commercial agreement may be required depending on the project and intended use.

Do NOT advertise a fixed reselling percentage or fixed resale fee on the pricing page.

The commercial arrangement is discussed based on the project.

---

# 18. Hosting FAQ

Question:

> **Do you provide hosting?**

Answer:

> Hosting is not included in the project price by default.

The client can:

1. Host the application using their own infrastructure/accounts, or
2. Ask the developer to host and manage the application.

If the developer provides hosting/management, it is charged separately.

Possible additional costs may include:

* Server
* Domain
* Third-party services
* API usage
* AI usage
* Phone numbers
* WhatsApp-related services
* Other infrastructure/services required by the project

Do not show a fixed hosting price unless one is configured later.

---

# 19. Third-Party Services / Integrations FAQ

Question:

> **Are third-party services and integrations included?**

Answer:

> Integrations depend on the project and the services involved.

Some services may require the client's own account, permissions, API access, subscription, or approval.

For example, certain CRM platforms may restrict external integrations or require configuration from the client's side.

Third-party usage fees are not automatically included in the development price unless specifically agreed upon.

The exact integrations and related costs will be discussed during the project planning stage.

---

# 20. Language

The current application/service presentation should be in **English**.

Do not add a language switcher at this stage.

Additional languages can be considered later as a project requirement.

---

# 21. Current Mobile App Positioning

Do not advertise Mobile Apps as one of the main pricing offers.

The current primary application service is:

> **Custom Web Applications**

Mobile application development may be discussed as a custom request.

Currently:

* Mobile development is not the main advertised service.
* App Store publishing is not offered as a standard service.
* Google Play publishing is the client's responsibility if mobile development is agreed upon.

Do not clutter the Pricing section with this unless there is an appropriate FAQ or note.

---

# 22. Important Pricing Copy

Use these exact starting prices:

### Voice AI Agent

**Starting from $1,000**

### AI Chatbot

**Starting from $600**

### Custom Web Application

**Starting from $3,000**

### Complete AI Business Solution

**Starting from $4,000**

Never display these as fixed final prices.

Always make the distinction clear:

> **These are starting prices, not fixed project prices. Final pricing depends on your requirements, project scope, integrations, and complexity.**

---

# 23. Design Direction

The pricing section should feel:

* Premium
* Modern
* Professional
* Trustworthy
* Clear
* Conversion-focused
* AI/software oriented

Do NOT make it look like a generic SaaS pricing table.

Do NOT use:

> Basic / Pro / Enterprise

because these are not fixed subscription plans.

These are custom project offers.

Use strong outcome-oriented headlines and benefits.

The pricing cards should have enough visual hierarchy that the user immediately understands:

1. What the service does
2. What value it provides
3. Starting price
4. Typical timeline
5. That the card is clickable for more details

---

# 24. Hormozi-Inspired Value Positioning

Use the principles of strong value communication:

* Focus on the client's desired outcome.
* Make the benefits obvious.
* Reduce uncertainty.
* Show what happens next.
* Make the offer easy to understand.
* Avoid unnecessary technical jargon.
* Do not make unrealistic guarantees.
* Clearly explain what is included and what depends on project scope.

Do NOT copy any specific person's writing style or imitate a real person's exact wording.

Use original professional copy based on value-focused offer principles.

---

# 25. Responsive Design

The entire pricing experience must work correctly on:

* Desktop
* Tablet
* Mobile

On desktop, pricing cards can appear in a row/grid.

On mobile, stack the cards vertically.

The flip interaction must remain usable on touch devices.

The FAQ accordions must be easy to tap.

The WhatsApp CTA must be clearly visible and usable on mobile.

---

# 26. Accessibility

Ensure:

* Buttons are keyboard accessible.
* Cards do not rely only on hover.
* Clickable cards have clear focus states.
* Accordion controls use accessible buttons.
* Screen readers can understand expanded/collapsed states.
* The arrow rotates or changes state appropriately.
* Do not hide important information behind hover-only interactions.

---

# 27. Do Not Break Existing Website

This is extremely important.

Do not:

* Replace the existing website
* Rewrite unrelated components
* Change existing colors unnecessarily
* Change the existing navbar design
* Remove existing sections
* Change existing portfolio content
* Change existing animations unless required for integration
* Add unnecessary dependencies
* Rewrite the project architecture

Only implement what is necessary for the Pricing feature.

Reuse existing components and utilities wherever possible.

---

# 28. Final Page Structure

The resulting section/page should conceptually be:

```text
Existing Navbar
        ↓
Pricing
        ↓
Short Pricing Introduction
        ↓
4 Pricing Cards

[ Voice AI Agent ]
Starting from $1,000

[ AI Chatbot ]
Starting from $600

[ Custom Web Application ]
Starting from $3,000

[ Complete AI Business Solution ]
Starting from $4,000

        ↓

Starting-price disclaimer

"These are starting prices, not fixed project prices.
Final pricing depends on your requirements, project scope,
integrations, and complexity."

        ↓

Have questions?
[ Contact Me on WhatsApp ]

        ↓

FAQ

What are the steps?                    <
What is the refund policy?             <
What happens after the project?        <
How does payment work?                 <
Will I receive the source code?        <
Can I resell or white-label the solution? <
Do you provide hosting?                <
Are third-party services included?     <
```

Each FAQ question should expand/collapse when clicked.

---

# 29. Final CTA

At the bottom of the Pricing/FAQ section, add a final CTA:

> **Have a project in mind?**

> Tell me what you want to build, and we'll discuss the best solution for your business.

Button:

> **Discuss Your Project**

The button should connect to the website's existing contact mechanism.

---

# 30. Implementation Requirement

Before writing code:

1. Inspect the existing project structure.
2. Identify the current navbar component.
3. Identify the current design system/components.
4. Identify the current contact/WhatsApp configuration.
5. Identify the current routing/navigation system.
6. Reuse existing UI patterns.
7. Implement Pricing without breaking existing functionality.

Do not assume technologies or create duplicate systems when an existing implementation already exists.

After implementation:

* Run the project.
* Check desktop layout.
* Check mobile layout.
* Test every pricing card interaction.
* Test currency switching.
* Test every FAQ accordion.
* Test WhatsApp CTA.
* Test navbar Pricing navigation.
* Check for console errors.
* Check for broken links.
* Check accessibility basics.
* Make sure existing website sections still work.

Do not stop after creating the UI. Verify the implementation works in the actual existing application.
