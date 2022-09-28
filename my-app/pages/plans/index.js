import React, { useState } from 'react';
import MealPlanList from '../../components/plans/mealPlanList';

export default function PlanShow({ plans }) {
  const [didShare, setDidShare] = useState(false);
  // Format text and copy it to clipboard
  const share = () => {
    let textToShare = ``;
    plans.forEach((plan) => {
      textToShare =
        textToShare + `${plan.meal.title} \r\n ${plan.meal.whereToFind} \r\n`;
      if (plan.ingredients.length > 0) {
        plan.ingredients.forEach((listItem) => {
          const isComplete = listItem.isCompleted ? '☒' : '☐';
          textToShare = textToShare + `${isComplete} ${listItem.title} \r\n`;
        });
        textToShare = textToShare + '\r\n';
      } else {
        textToShare = textToShare + '\r\n';
      }
    });

    console.log(textToShare);
    var textField = document.createElement('textarea');
    // textToShare = textToShare.replace(/\r?\n/g, '<br />');

    textField.innerHTML = textToShare;

    const parentElement = document.getElementById('needed-for-copy');
    parentElement.appendChild(textField);

    textField.select();
    document.execCommand('copy');
    setDidShare(true);

    textField.remove();
    // navigator.clipboard
    //   .writeText(textToShare)
    //   .then(() => {
    //     /* clipboard successfully set */
    //     setDidShare(true);
    //     alert('successfully copied');
    //   })
    //   .catch(() => {
    //     alert('something went wrong');
    //     console.log('something went wrong with writing to the clipboard');
    //   });
  };

  return (
    <div>
      <div
        className="d-flex w-100 justify-content-between"
        id="needed-for-copy"
      >
        <h1>Weekly plan</h1>
        <button type="button" className="btn btn-link">
          <h5 onClick={share}>{didShare ? 'Copied to clipboard' : 'Share'}</h5>
        </button>
      </div>
      <MealPlanList planList={plans} />
    </div>
  );
}

PlanShow.getInitialProps = async (context, client) => {
  const { data: plans } = await client.get('/api/plans');

  console.log(plans);
  return { plans };
};
