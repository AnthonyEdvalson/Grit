import React, { useEffect, useState} from 'react';
import actions from './actions';
import useGritHistory from './useGritHistory';
import HistoryProvider from './useGritHistory/HistoryProvider';
import useSaved from './useGritHistory/useSaved';
import moment from 'moment';
import "./App.css"

moment.relativeTimeThreshold("ss", 10);
moment.relativeTimeThreshold("s", 60);
moment.relativeTimeThreshold("m", 60);
moment.relativeTimeThreshold("h", 24);

function signedNumber(num: number) {
  let mag = Math.abs(num);
  let sign = num >= 0 ? "+" : "−";
  return sign + mag;
}

function GritAmount(props: any) {
  return (
    <>
      {signedNumber(props.amount)}<span className="g" />
    </>
  )
}


function ActionCard(props: any) {
  let { startActive, endActive, action, active, history } = props;
  let key = action.key;
  let name = action.name;

  let currentRate = action.currentRate(history);
  let nextRate = action.nextRate(history);
  let timeToNextRate = action.timeToNextRate(history);
  let currentDuration = action.currentDuration(history);

  let isActive = active.has(key);
  let previews = isActive ? 1 : 2;

  let skips = 0;
  while(skips < action.schedules.length && action.schedules[skips].delay < currentDuration)
    skips++;

  let timeTo = (mins: number) => moment().to(moment().add(mins, "minutes"));

  return (
    <div className={"ActionCard" + (isActive ? " active" : "")} onClick={() => isActive ? endActive(key) : startActive(key)}>
      <span className="name">{name + " " + moment.utc(currentDuration * 60 * 1000).format('HH:mm')}</span>
      <div className="rate"><GritAmount amount={currentRate * 60} /></div>
      <div className="rewards">
      {
        isActive && (nextRate !== currentRate) && (
          <div className="reward">
            Rate becomes <GritAmount amount={nextRate * 60} /> {timeTo(timeToNextRate)}
          </div>
        )
      }
      {
        action.scheduleDetails(history).slice(skips, skips + previews).map((details: any, index: number) => {
          let streak = details.streak + 1;
          let streakMsg = streak > 1 ? ` (${streak})` : '';
          let amount = details.currentAmount;

          let delay;
          if (details.schedule.delay === 0)
            delay = amount > 0 ? "reward for starting" : "cost to start";
          else {
            delay = (amount > 0 ? "reward " : "cost ") + timeTo(details.timeToReward);
          }

          return (
            <div className="reward" key={index}>
              <GritAmount amount={amount} /> {delay}{streakMsg}
            </div>
          )
        })
      }
      </div>
    </div>
  )
}

function Dash(props: any) {
  let [active, setActive]: [Set<string>, React.Dispatch<React.SetStateAction<Set<string>>>] = useState(new Set());
  let [history, record] = useGritHistory();

  let [wallet, setWallet] = useSaved("./wallet.json", 0);
  let adjustWallet = (a: number) => setWallet(p => p + a);

  let delta = 0;
  active.forEach(a => {
    let action = actions.get(a);
    if (action && history !== null)
      delta += action.currentRate(history);
  });

  let updateDelay = 5;
  useEffect(() => {
    let inter = window.setInterval(() => {
      adjustWallet(delta * updateDelay);
      active.forEach(a => {
        let action = actions.get(a);
        if (action && history !== null) {
          let details = action.scheduleDetails(history);

          for (let detail of details) {
            if (detail.hit) {
              let amount = detail.currentAmount;
              console.log("REWARDED", amount);
              let amountString = signedNumber(amount) + "⏣";
              let gotSpent = amount > 0 ? "earned" : "spent";
              let streak = detail.streak + 1;
              let streakMsg = streak > 1 ? ` ${streak} days in a row` : '';

              new Notification(amountString, {body: `You ${gotSpent} ${amountString} for doing ${action.name}${streakMsg}`, silent: true})

              adjustWallet(amount);
            }
          }

          record({ action: action.key, mins: updateDelay });
        }
      })
    }, 60 * updateDelay * 1000);

    return () => window.clearInterval(inter);
  }, [adjustWallet, delta]);

  // ===

  let startActive = (name: string) => setActive(s => new Set([name, ...Array.from(s)]));
  let endActive = (name: string) => setActive(s => { let s2 = new Set(s); s2.delete(name); return s2; });
  let tracking = active.size > 0;

  return (
    <div className={"dash" + (tracking ? " tracking" : "")}>
      <div className="wallet">{Math.round((wallet + Number.EPSILON) * 1000) / 1000}<span className="g" /></div>
      <div className="actions">
        {
          Array.from(actions.values()).map(action => (
            <ActionCard
              key={action.key}
              startActive={startActive}
              endActive={endActive}
              active={active}
              action={action}
              history={history}
            />
          ))
        }
      </div>
    </div>
  )
}

export default function App() {
  return (
    <HistoryProvider>
      <Dash />
    </HistoryProvider>
  );
}
