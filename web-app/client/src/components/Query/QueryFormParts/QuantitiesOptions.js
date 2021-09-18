import React from 'react'
import { useDispatch } from 'react-redux'
import { setQueryInput } from '../../../actions/query'
import { produce } from 'immer'
import { Form } from 'semantic-ui-react'
import '../Query.css'
import './QuantitiesOptions.css'

const qtyOptionsValues = [
  {
    type: 'netSales', title: 'Net Sales',
    subTypeSets: [
      { set: 1,
        subtypes: [
          { subtype: 'combined', title: 'combined' },
          { subtype: 'cash',     title: 'cash' },
          { subtype: 'credit',   title: 'credit' },
        ]
      }
    ]
  },
  {
    type: 'netMoney', title: 'Net Revenue',
    subTypeSets: [
      { set: 1,
        subtypes: [
          { subtype: 'combined',   title: 'combined' },
          { subtype: 'cash',       title: 'cash' },
          { subtype: 'credit',     title: 'credit' },
          { subtype: 'unRefunded', title: 'unrefunded' },
        ]
      }
    ]
  },
  {
    type: 'vehicles', title: 'Vehicles',
    subTypeSets: [
      { set: 1,
        subtypes: [
          { subtype: 'combined', title: 'combined' },
        ]
      },
      { set: 2,
        subtypes: [
          { subtype: 'cash',     title: 'cash' },
          { subtype: 'credit',   title: 'credit' },
          { subtype: 'account',  title: 'account' },
          { subtype: 'employee', title: 'employee' },
        ]
      },
      { set: 3,
        subtypes: [
          { subtype: 'works',    title: 'works' },
          { subtype: 'premium',  title: 'premium' },
          { subtype: 'deluxe',   title: 'deluxe' },
          { subtype: 'express',  title: 'express' },
        ]
      }
    ]
  },
]


const QuantitiesOptions = ({queryInput}) => {

  const { quantities } = queryInput
  const dispatch = useDispatch()

  const toggleQtySel = (category, selection) => {
    const newQueryInput = produce(queryInput, (draftState) => {
      draftState.quantities[category][selection] =
        !draftState.quantities[category][selection]
    })
    dispatch(setQueryInput(newQueryInput))
  }

  const toggleQtyAll = () => {
    let numSelected = 0
    for (let qtyObj of Object.values(quantities)) {
      for (let bool of Object.values(qtyObj)) {
        numSelected += bool
      }
    }
    const valueForAllQty = numSelected < 8 ? true : false
    const newQueryInput = produce(queryInput, (draftState) => {
      for (let [qtyType, qtyObj] of Object.entries(draftState.quantities)) {
        for (let qty of Object.keys(qtyObj)) {
          draftState.quantities[qtyType][qty] = valueForAllQty
        }
      }
    })
    dispatch(setQueryInput(newQueryInput))
  }

  return (<div>
    <Form.Field className="boxed upper-level">

      <div className="query-sub-title">
        Quantities
      </div>

      <div className="query-option-space grid-container">

        {qtyOptionsValues.map((value, index) => (
          <React.Fragment key={`sub-sub-sec-${index+1}`}>
            <div className={`query-sub-sub-title title-sec-${index+1}`}>
              {value.title}
            </div>
            <div className={`qty-input-section input-sec-${index+1}`}>
              {value.subTypeSets.map((subValue, idx) => (
                <div
                  className="query-sub-sub-list"
                  key={`input-sec-${index+1}-sub-sub-list-${idx+1}`}
                >
                  {subValue.subtypes.map((obj, i) => (
                    <div
                      className="form-check qty"
                      key={`isec-${index+1}-sslist-${idx+1}-item-${i+1}`}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`${value.type}-${obj.subtype}`}
                        checked={quantities[value.type][obj.subtype] === true}
                        onChange={() =>
                          toggleQtySel(`${value.type}`, `${obj.subtype}`)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`${value.type}-${obj.subtype}`}
                      >
                        {obj.subtype}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}

        <div className="qty-input-section input-sec-4">

          <div className="query-sub-sub-list">
            <div>
              <button
                className="query-quantities-toggle-button"
                type="button"
                onClick={() => toggleQtyAll()}
              >
                toggle all
              </button>
            </div>
          </div>

        </div>

      </div>

    </Form.Field>
  </div>)

}


export default QuantitiesOptions