---
description: Generate a new milestone document with standardized template
---

You are helping the user create a new milestone document for the Waonder project.

## Instructions

1. Ask the user for the following information in a conversational way:
   - Milestone number (e.g., 5, 6, 7)
   - Milestone name (e.g., "Location-Based Story Discovery")
   - Scope description (1-3 sentences describing what this milestone achieves from a product perspective)
   - Key user stories (ask for 3-5 user stories that describe what users will be able to do)
   - Target completion (e.g., "Week 2 of MVP", "Q1 2025", "End of Sprint 3")

2. Once you have all the information, generate a markdown file with the following deterministic structure:

```markdown
# Milestone {number}: {name}

**Status:** Not Started
**Target:** {target}

## Scope

{scope description - what this milestone enables for users and the product}

## User Stories

{each user story as a bullet point in the format: "As a [user type], I want [goal] so that [benefit]"}

## Use Cases

### Primary Use Cases
- Use case 1: Description of key user workflow enabled by this milestone
- Use case 2: Description of another key user workflow

### Secondary Use Cases
- Use case 1: Description of supporting or edge case workflow
- Use case 2: Description of another supporting workflow

## Success Criteria

- [ ] Measurable outcome 1 (e.g., "Users can discover stories within 100m of their location")
- [ ] Measurable outcome 2 (e.g., "Stories load in under 2 seconds")
- [ ] Measurable outcome 3 (e.g., "Users can save stories to their collection")

## User Experience

### Expected User Flow
1. Step 1 in the user journey
2. Step 2 in the user journey
3. Step 3 in the user journey

### Key Interactions
- Interaction 1: How users engage with the feature
- Interaction 2: Another key user interaction

## Out of Scope

- Feature or capability explicitly excluded from this milestone
- Another item not included
- Deferred to future milestone

## Acceptance Criteria

1. First critical acceptance criterion
2. Second critical acceptance criterion
3. Third critical acceptance criterion

## Dependencies

- Dependency on other milestone or feature (if any)
- External service or integration required (if any)

## Risks and Assumptions

### Assumptions
- Assumption 1 about user behavior or technical constraints
- Assumption 2 about requirements

### Risks
- Risk 1 that could impact delivery
- Risk 2 that could affect user experience
```

3. Create the file at: `project_specs/{feature-name}/milestone.md`
   - The {feature-name} should be a slug generated from the milestone name: lowercase, spaces replaced with hyphens, special characters removed
   - If this is a general project milestone (not feature-specific), use: `project_specs/milestone-{number}-{slug}/milestone.md`
4. After creating the file, confirm to the user:
   - The file location
   - Remind them this is a product document focused on user value and outcomes
   - Suggest they can now define technical implementation details in separate technical specs

## Important Notes

- This is a PRODUCT document, not a technical document
- Focus on user value, use cases, and business outcomes
- Avoid technical implementation details (no database schemas, API endpoints, architecture diagrams)
- Technical details should go in separate technical specification documents
- Always use the exact template structure above for consistency
- Do not add emojis to the generated file
- Keep formatting clean and professional
- The template is deterministic - same inputs always produce the same output
- All checkbox items start unchecked `[ ]`
- Status always starts as "Not Started"
