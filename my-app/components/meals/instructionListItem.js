import React from 'react';
import useRequest from '../../hooks/use-request';

export function InstructionListItem({
  instruction,
  instructions,
  updateInstructions,
  index,
  editInstructions,
  createdMeal,
}) {
  const { doRequest: increaseInstruction, errors: increaseInstructionError } =
    useRequest({
      url: `/api/instructions/increase/${instruction.id}`,
      method: 'put',
      body: {},
      onSuccess: (event) => {
        var itemIndex = instructions
          .map((instruction) => instruction.id)
          .indexOf(instruction.id);

        var element = instructions[itemIndex];
        instructions.splice(itemIndex, 1);
        instructions.splice(itemIndex + 1, 0, element);

        updateInstructions(instructions);
      },
    });

  const { doRequest: decreaseInstruction, errors: decreaseInstructionError } =
    useRequest({
      url: `/api/instructions/decrease/${instruction.id}`,
      method: 'put',
      body: {},
      onSuccess: (event) => {
        var itemIndex = instructions
          .map((instruction) => instruction.id)
          .indexOf(instruction.id);

        var element = instructions[itemIndex];
        instructions.splice(itemIndex, 1);
        instructions.splice(itemIndex - 1, 0, element);

        updateInstructions(instructions);
      },
    });

  const { doRequest: deleteInstruction, errors: deleteInstructionError } =
    useRequest({
      url: `/api/instructions/${instruction.id}`,
      method: 'delete',
      body: {},
      onSuccess: (event) => {
        var removeIndex = instructions
          .map((instruction) => instruction.id)
          .indexOf(instruction.id);
        ~removeIndex && instructions.splice(removeIndex, 1);

        updateInstructions(instructions);
      },
    });

  return (
    <div className="d-flex w-100 justify-content-between">
      <p key={instruction.text}>
        {index + 1}. {instruction.text}
      </p>
      {createdMeal && editInstructions && (
        <div>
          <span
            className="badge bg-primary rounded-pill btn"
            onClick={() => {
              decreaseInstruction();
            }}
          >
            ↑
          </span>{' '}
          <span
            className="badge bg-primary rounded-pill btn"
            onClick={() => {
              increaseInstruction();
            }}
          >
            ↓
          </span>
          <span
            className="badge bg-danger rounded-pill btn"
            onClick={() => {
              deleteInstruction(instruction.id);
            }}
          >
            Delete
          </span>
        </div>
      )}
    </div>
  );
}
