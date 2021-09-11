import React from 'react'
import { useDispatch } from 'react-redux'
import { setQueryInput } from '../../../actions/query'
import { produce } from 'immer'
import { Form } from 'semantic-ui-react'
import '../Query.css'


const QuantitiesOptions = ({queryInput}) => {

  const { quantities } = queryInput
  const { netSales, netMoney, vehicles } = quantities
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
    <Form.Field className="boxed">

      <div className="query-sub-title">
        Quantities
      </div>

      <div className="query-option-space">

        <div className="query-sub-option-space">
          <div className="query-sub-sub-title">
            Net Sales
          </div>
          <div className="query-sub-sub-list">
            <div className="form-check">
              <input
                className="form-check-input checkbox"
                type="checkbox"
                id="net-sales"
                checked={netSales.combined === true}
                onChange={() => toggleQtySel('netSales', 'combined')}
              />
              <label className="form-check-label" htmlFor="net-sales">
                combined
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input checkbox"
                type="checkbox"
                id="net-sales-cash"
                checked={netSales.cash === true}
                onChange={() => toggleQtySel('netSales', 'cash')}
              />
              <label className="form-check-label" htmlFor="net-sales-cash">
                cash
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input checkbox"
                type="checkbox"
                id="net-sales-credit"
                checked={netSales.credit === true}
                onChange={() => toggleQtySel('netSales', 'credit')}
              />
              <label className="form-check-label" htmlFor="net-sales-credit">
                credit
              </label>
            </div>
          </div>
        </div>

        <div className="query-sub-option-space">
          <div className="query-sub-sub-title">
            Net Money
          </div>
          <div className="query-sub-sub-list">
            <div className="form-check">
              <input
                className="form-check-input checkbox"
                type="checkbox"
                id="net-money-comb"
                checked={netMoney.combined === true}
                onChange={() => toggleQtySel('netMoney', 'combined')}
              />
              <label className="form-check-label" htmlFor="net-money-comb">
                combined
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input checkbox"
                type="checkbox"
                id="net-money-cash"
                checked={netMoney.cash === true}
                onChange={() => toggleQtySel('netMoney', 'cash')}
              />
              <label className="form-check-label" htmlFor="net-money-cash">
                cash
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input checkbox"
                type="checkbox"
                id="net-money-credit"
                checked={netMoney.credit === true}
                onChange={() => toggleQtySel('netMoney', 'credit')}
              />
              <label className="form-check-label" htmlFor="net-money-credit">
                credit
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input checkbox"
                type="checkbox"
                id="net-money-unref"
                checked={netMoney.unRefunded === true}
                onChange={() => toggleQtySel('netMoney', 'unRefunded')}
              />
              <label className="form-check-label" htmlFor="net-money-unref">
                unrefunded
              </label>
            </div>
          </div>
        </div>

        <div className="query-sub-option-space">
          <div className="query-sub-sub-title">
            Vehicles
          </div>

          <div className="query-sub-multi-list">

            <div className="query-sub-sub-list">
              <div className="form-check">
                <input
                  className="form-check-input checkbox"
                  type="checkbox"
                  id="vhcls-comb"
                  checked={vehicles.combined === true}
                  onChange={() => toggleQtySel('vehicles', 'combined')}
                />
                <label className="form-check-label" htmlFor="vhcls-comb">
                  combined
                </label>
              </div>
            </div>

            <div className="query-sub-sub-list">
              <div className="form-check">
                <input
                  className="form-check-input checkbox"
                  type="checkbox"
                  id="vhcls-cash"
                  checked={vehicles.cash === true}
                  onChange={() => toggleQtySel('vehicles', 'cash')}
                />
                <label className="form-check-label" htmlFor="vhcls-cash">
                  cash
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input checkbox"
                  type="checkbox"
                  id="vhcls-credit"
                  checked={vehicles.credit === true}
                  onChange={() => toggleQtySel('vehicles', 'credit')}
                />
                <label className="form-check-label" htmlFor="vhcls-credit">
                  credit
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input checkbox"
                  type="checkbox"
                  id="vhcls-acc"
                  checked={vehicles.account === true}
                  onChange={() => toggleQtySel('vehicles', 'account')}
                />
                <label className="form-check-label" htmlFor="vhcls-acc">
                  account
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input checkbox"
                  type="checkbox"
                  id="vhcls-emp"
                  checked={vehicles.employee === true}
                  onChange={() => toggleQtySel('vehicles', 'employee')}
                />
                <label className="form-check-label" htmlFor="vhcls-emp">
                  employee
                </label>
              </div>
            </div>

            <div className="query-sub-sub-list">
              <div className="form-check">
                <input
                  className="form-check-input checkbox"
                  type="checkbox"
                  id="vhcls-w"
                  checked={vehicles.works === true}
                  onChange={() => toggleQtySel('vehicles', 'works')}
                />
                <label className="form-check-label" htmlFor="vhcls-w">
                  works
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input checkbox"
                  type="checkbox"
                  id="vhcls-p"
                  checked={vehicles.premium === true}
                  onChange={() => toggleQtySel('vehicles', 'premium')}
                />
                <label className="form-check-label" htmlFor="vhcls-p">
                  premium
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input checkbox"
                  type="checkbox"
                  id="vhcls-d"
                  checked={vehicles.deluxe === true}
                  onChange={() => toggleQtySel('vehicles', 'deluxe')}
                />
                <label className="form-check-label" htmlFor="vhcls-d">
                  deluxe
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input checkbox"
                  type="checkbox"
                  id="vhcls-e"
                  checked={vehicles.express === true}
                  onChange={() => toggleQtySel('vehicles', 'express')}
                />
                <label className="form-check-label" htmlFor="vhcls-e">
                  express
                </label>
              </div>
            </div>

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

      </div>

    </Form.Field>
  </div>)

}


export default QuantitiesOptions