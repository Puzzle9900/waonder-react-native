
# Constraints

- All created docs needs to be contained into the feture related folder. Example project-specs/tech-specs/new-feature-name-folder
- Do not implement anything we are just planning specs and implementation plan.

# Current State

- The specs of this project are created in ./project-specs/tech-specs
- The specs are hour single source of truth for all the content in this project
- All the specs have been implemented. The completition of every spec has been tracked in the folder impl-plan relatative to that spec. Example project-specs/tech-specs/master/impl-plan for the master spec.
- Your job is to create a new feature out of the existing specs.
- The new feature create a new folder inside the tech-specs folder with the name of the milestone feature. Examples project-specs/tech-specs/new-feature-name-folder
- Inside that folder create the spec document
- Create an implementation plan for the feature inside project-specs/tech-specs/new-feature-name-folder
- You will not read any other document outside the folder project-specs since all the information you need is here and it is your source of truth.
- To the name of the feature add a date to the name about when it was introduced.

# Future State

- So overall your concern is to create/expand/improve specs for the new feature and create/expand/verify implementation plan.
  
## The following are the features we would like to define specs for

- Zoom In and Out in the playground app is a very bad experience today.
- Scrolling to Zoom In/Out is a very slow operation I have to scroll in a lot of time and there is not a direct coordiation between the zooming operation and the app zoom.
- We want to fix that behavior and ensure zoom work smooth.
- Ensure the new definitions are consice and small.
