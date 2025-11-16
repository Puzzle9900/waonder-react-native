
# Constraints

- Read the impl-plan plans inside the folders project-specs/tech-specs/12-11-25-responsive-zoom-experience
- Never change tech-specs since it is the source of truth.
- Ensure do not break any of the completed tasks.
- Ensure you handle a single task, for handling another task not related just stop the session and we will start other.

# Current State

- Verify the project is working/building at this stage.
- Verify the app is running without error using chrome devtools mcp mcp. If any error is found fix the error if related to existing task.
- Pick the task related to the issue if there any and fix it.

# Future State

- If not errors pick only one of the tasks not completed in the correct order to generate progress from what is pending in the implemnentation plan.
- Solve the task.
- Mark the task as completed in the plan. Only if the app is working at the stage
- Verify with chrome devtools mcp everything is fine again after completing each task.
- Mark the task as completed inside the related ./project-specs/.. docs if needed.
- Add new tasks to impl-plan if needed always as it meets with the tech-specs requirmements.

# Feature modifications to apply in spec and impl plan

- We do not want to delay the scroll, to zoom in or out.
- We want it zoom in and out in real time as we scroll

# When no more task are pending to be completed exit claude with code 1
