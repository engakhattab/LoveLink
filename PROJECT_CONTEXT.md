# LoveLink Project Context

## Purpose of This File

This document is the source of product and implementation context for any AI tool or developer working on this repository.

It explains:

- what LoveLink is trying to achieve
- the business logic behind the product
- what has already been implemented
- what is still missing
- where the source of truth lives in the codebase

Everything below is based on the tracked code in this repository as of March 15, 2026.

## What LoveLink Is

LoveLink is a productized romantic digital gift business.

The idea is to create personalized mini-sites for couples, where one partner receives a private, emotionally designed web experience built from:

- names
- a meaningful date
- private messages
- photos
- a final emotional reveal

The product is not a generic social app and not a marketplace. It is a curated delivery model: each order becomes a customized romantic webpage based on a predefined package template.

## Main Business Goal

The main goal of LoveLink is to turn personal memories and emotions into a polished, private, easy-to-share digital gift that feels intimate and premium without requiring custom engineering for every customer.

In practical terms, the business goal is:

1. sell fixed romantic website packages
2. keep each package emotionally strong but operationally simple
3. customize each delivery by editing content only, not rebuilding product logic from scratch
4. reuse the same architecture across many customers
5. increase package value by tiering the experience from simple to richer storytelling

## Core Business Logic

The business logic of the project is based on tiered romantic experiences.

Each tier represents:

- a different emotional depth
- a different amount of content
- a different level of interactivity
- a different amount of work/value

The current product logic is:

- `Lamsa` is the lighter, simpler romantic package
- `Zekra` is the richer mid-tier package
- `Hekaya` is planned as a future higher-tier package but is not implemented yet

Each package is intentionally constrained. That is an important part of the business model.

Instead of allowing unlimited content, each tier has fixed rules such as:

- exact number of photos
- exact number of message cards
- specific unlock method
- predefined emotional flow

This keeps fulfillment fast, quality consistent, and scope controlled.

## Current Status Summary

### Implemented

- `Lamsa`
- `Zekra`

### Not Implemented Yet

- `Hekaya`

There are currently no tracked `Hekaya` files or references in the repository. Any AI should treat `Hekaya` as planned product direction, not existing code.

## Confirmed Product Architecture

This repository currently contains two separate frontend apps:

- `F:\LoveLink\Lamsa`
- `F:\LoveLink\zekra`

Both are built with:

- React
- TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- local font packages

The current implementation is frontend-only and static in nature.

Important implications:

- there is no backend
- there is no database
- there is no real authentication system
- access protection is presentation-level only
- customer customization happens through local config files and local assets

## Business Model in Operational Terms

LoveLink works like a reusable delivery system for romantic gift pages.

Operational flow:

1. choose a package tier
2. collect customer content
3. place customer assets in the correct public folder
4. edit the package config file
5. build the app
6. deliver or deploy the finished page

This means the real "content CMS" today is code-level configuration, not an admin dashboard.

## Package 1: Lamsa

### Positioning

`Lamsa` is the simpler, lighter romantic package.

The repository README explicitly describes it as:

- the `Lamsa` package
- version `v1`
- priced at `100 EGP`

### Business Intent

Lamsa is designed to be:

- affordable
- fast to prepare
- emotionally elegant
- limited by design

It is the entry-level offer for customers who want a sweet private page without advanced interactivity.

### Customer Experience Flow

The actual implemented flow in code is:

1. password gate
2. anticipation reveal screen
3. unlocked experience with structured sections

The stage model in code is:

- `locked`
- `revealing`
- `unlocked`

### Lamsa Unlock Logic

The page is unlocked by matching a plain frontend password from config.

Source of truth:

- `F:\LoveLink\Lamsa\src\content\lamsa.config.ts`

Important note:

- this is not secure authentication
- it is a soft privacy gate for a gift experience

That matches the business need: privacy and anticipation, not account security.

### Lamsa Content Contract

Lamsa expects exactly:

- `1` password
- `1` receiver name
- `1` sender name
- `1` meaningful date
- `1` main message
- exactly `4` photos
- `1` locale (`en` or `ar`)

Source types:

- `F:\LoveLink\Lamsa\src\types\gift.ts`

Runtime rule:

- if there are not exactly `4` photos, the page shows an invalid config state instead of rendering the experience

### Lamsa Emotional Sections

Once unlocked, the page renders this emotional sequence:

1. names header
2. welcome section
3. meaningful date section
4. 4-photo memory grid
5. one main message
6. closing note

This is a short, controlled, emotionally warm journey.

### Lamsa Design Logic

Lamsa emphasizes:

- softness
- romance
- simple reveal pacing
- mobile-first layout
- bilingual support

It includes a deliberate anticipation step:

- `AnticipationReveal` waits `2800ms` before entering the final content

This is part of the emotional product design, not just visual decoration.

### Lamsa Customization Inputs

Primary config file:

- `F:\LoveLink\Lamsa\src\content\lamsa.config.ts`

Customer images folder:

- `F:\LoveLink\Lamsa\public\images\lamsa`

Main source-of-truth entry:

- `F:\LoveLink\Lamsa\src\App.tsx`

## Package 2: Zekra

### Positioning

`Zekra` is the richer mid-tier romantic package.

The repository README explicitly describes it as:

- the `Zekra` package
- version `v2`
- a more interactive package than Lamsa

No price is explicitly stated in the tracked code, so an AI should not invent one.

### Business Intent

Zekra exists to increase emotional depth and perceived value by adding:

- a more memorable unlock step
- richer animation
- more content volume
- more interaction with messages and photos
- a stronger ending reveal

It is still templated and controlled, but noticeably more premium than Lamsa.

### Customer Experience Flow

The actual implemented flow in code is:

1. heart-shaped date gate
2. animated bridge/loading scene
3. unlocked experience with multiple interactive sections

The stage model in code is:

- `locked`
- `bridge`
- `unlocked`

### Zekra Unlock Logic

Zekra does not use a normal password string.

Instead, the unlock secret is a date composed of:

- year
- month
- day

Source of truth:

- `F:\LoveLink\zekra\src\content\zekra.config.ts`

This unlock date has dual business meaning:

1. it is the private gate key
2. it is also the starting point for the live love counter

That is an important design decision because it ties access control to emotional meaning.

### Zekra Content Contract

Zekra expects:

- `1` receiver name
- `1` sender name
- `1` unlock date
- `1` locale (`ar` or `en`)
- `1` intro line
- optional loading GIF source and alt text
- exactly `3` message cards
- exactly `6` photos
- a caption for each photo
- `1` final floating message
- optional pre-split final lines
- optional theme overrides

Source types:

- `F:\LoveLink\zekra\src\types\zekra.ts`

Runtime validation rules:

- the unlock date must be structurally valid
- there must be exactly `3` messages
- there must be exactly `6` photos

If validation fails, the app renders an invalid config state.

### Zekra Emotional Sections

Once unlocked, the page renders this sequence:

1. hero section
2. live love counter
3. 3-card interactive message deck
4. 6-photo memory section with captions
5. full-screen final floating message reveal

### Zekra Interaction Logic

Zekra adds meaningful interactivity beyond Lamsa:

- date-dial unlock gate
- animated bridge scene after unlock
- live counter updating every second
- message cards that flip to reveal hidden text
- swipe navigation between message cards
- photo hover/tap emoji burst feedback
- final message opened in a fullscreen portal modal

This is important product logic, because Zekra is not just "more content." It is "more interaction + more emotional pacing."

### Zekra Performance Logic

Zekra also includes a small performance-aware decision:

- it reduces ambient particle intensity on lower-end devices using navigator hardware/memory heuristics

This shows the product is designed to stay polished on weaker phones, which matters for mobile gift sharing.

### Zekra Customization Inputs

Primary config file:

- `F:\LoveLink\zekra\src\content\zekra.config.ts`

Customer images folder:

- `F:\LoveLink\zekra\public\images\zekra`

Main source-of-truth entry:

- `F:\LoveLink\zekra\src\App.tsx`

## Hekaya Status

`Hekaya` is not implemented yet.

Confirmed status:

- no tracked `Hekaya` app folder exists
- no tracked `Hekaya` source files exist
- no tracked `Hekaya` references were found in the repository

Therefore:

- `Hekaya` should be treated as roadmap only
- no AI should assume there is partially hidden `Hekaya` logic in this repo
- any future `Hekaya` work will need fresh product and technical definition

## What We Have Already Done

This is the most accurate summary of completed work in the repo:

1. created a tiered LoveLink product structure instead of one generic site
2. implemented `Lamsa` as the simpler entry-level romantic experience
3. implemented `Zekra` as the richer mid-tier romantic experience
4. designed both tiers around config-driven customer customization
5. kept both products frontend-only for fast fulfillment and simple deployment
6. added bilingual support with `ar` and `en` locale handling
7. built reusable shared UI primitives inside each app
8. added staged unlock flows instead of immediately showing content
9. added runtime validation so broken content configs fail safely
10. separated customer assets into package-specific public image folders
11. built responsive, animated, emotionally sequenced experiences for both implemented tiers
12. did not implement `Hekaya` yet

## Source of Truth for Future AI Work

If another AI continues work in this repository, it should treat these locations as primary:

### Lamsa

- app entry: `F:\LoveLink\Lamsa\src\App.tsx`
- experience orchestration: `F:\LoveLink\Lamsa\src\templates\lamsa\LamsaExperience.tsx`
- content config: `F:\LoveLink\Lamsa\src\content\lamsa.config.ts`
- content types: `F:\LoveLink\Lamsa\src\types\gift.ts`
- theme tokens: `F:\LoveLink\Lamsa\src\style.css`

### Zekra

- app entry: `F:\LoveLink\zekra\src\App.tsx`
- experience orchestration: `F:\LoveLink\zekra\src\templates\zekra\ZekraExperience.tsx`
- content config: `F:\LoveLink\zekra\src\content\zekra.config.ts`
- content types: `F:\LoveLink\zekra\src\types\zekra.ts`
- theme tokens: `F:\LoveLink\zekra\src\style.css`

## Important Repository Note

There is also a tracked folder:

- `F:\LoveLink\Lamsa\files`

Inference:

- this appears to be a flat template export or legacy mirror of the Lamsa app files

Reason for the inference:

- the real runnable app clearly uses `F:\LoveLink\Lamsa\src`
- `F:\LoveLink\Lamsa\files` contains duplicated names in a flattened structure

Recommendation for future AI tools:

- use `Lamsa/src` as the primary source of truth unless there is a specific task about packaging or template export

## Strategic Product Reading

From a business perspective, LoveLink currently follows this ladder:

- `Lamsa`: simple, elegant, affordable, emotionally direct
- `Zekra`: richer, more interactive, more premium-feeling
- `Hekaya`: intended future expansion, not yet built

That means the product strategy is not random feature addition.

It is a controlled upsell path:

1. start with a minimal emotional gift
2. increase value through interactivity and storytelling
3. later expand into a fuller premium narrative product

## If Another AI Needs To Continue the Project

The safest assumptions are:

- this repo is a tiered romantic mini-site business
- the current shipping products are `Lamsa` and `Zekra`
- `Hekaya` is not started
- content is injected through config files, not a backend
- package constraints are intentional business rules, not temporary hacks
- the emotional flow is part of the product logic
- changes should preserve package differentiation unless the business explicitly wants to reposition tiers

## Short One-Paragraph Summary

LoveLink is a business for selling customized romantic mini-sites as fixed package tiers. In this repository, `Lamsa` is the implemented simple package and `Zekra` is the implemented richer mid-tier package, both built as static React/Vite apps customized through config files and local assets. Their business logic depends on controlled emotional flows, strict content limits, bilingual support, and reusable templates that make customer delivery fast and repeatable. `Hekaya` is planned but has not been implemented yet.
