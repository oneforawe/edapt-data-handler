import React from 'react'
import { Form } from 'semantic-ui-react'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { produce } from 'immer'

import 'react-accessible-accordion/dist/fancy-example.css'
import 'react-datepicker/dist/react-datepicker.css'
import '../Query.css'


const daysAgoOptions = [
  { value: '14', label: '14' },
  { value: '7',  label: '7' },
  { value: '6',  label: '6' },
  { value: '5',  label: '5' },
  { value: '4',  label: '4' },
  { value: '3',  label: '3' },
  { value: '2',  label: '2' },
  { value: '1',  label: '1' },
]


const TimeOptions = ({timeOptionsInput}) => {
  const { queryInput, setQueryInput } = timeOptionsInput
  const { timeOptions } = queryInput
  const {
    // yesterday, daysAgo,
    today, intvlStart, intvlFinal, reportDate, timeSearchSel,
  } = timeOptions
  // Although `daysAgo` is not extracted, it is manipulated by the form.
  // The parameters `today` and `yesterday`, however, are not manipulated.

  const setTimeOption = (selection, value) => {
    setQueryInput( produce(draftState => {
      draftState.timeOptions[selection] = value
    }) )
  }

  const timeItems = [{}, {}, {}]

  timeItems[0].uuid = 'byNdays'
  timeItems[1].uuid = 'byInterval'
  timeItems[2].uuid = 'byDate'
  timeItems[0].heading = 'Search by previous N days'
  timeItems[1].heading = 'Search by date range'
  timeItems[2].heading = 'Search by date'

  timeItems[0].content =
    <Form.Field
      id="search-by-prev-N-days"
    >
      <label>
        <span className="input-label">
          N:
        </span>
        <Select
          className="select"
          defaultInputValue="7"
          //defaultValue="7"
          //inputValue={daysAgo} // this breaks desired behavior
          onChange={option => setTimeOption('daysAgo', option.value)}
          options={daysAgoOptions}
        />
      </label>
    </Form.Field>

  timeItems[1].content =
    <Form.Field
      id="search-by-date-range"
    >
      <div>
        <label>
          <span className="input-label">
            Start Date:
          </span>
          <DatePicker
            dateFormat="yyyy-MM-dd"
            selected={intvlStart}
            onChange={date => setTimeOption('intvlStart', date)}
            selectsStart
            startDate={intvlStart}
            endDate={intvlFinal}
            // minDate={}
            maxDate={today}
          />
        </label>
      </div>
      <div>
        <label>
          <span className="input-label">
            Final Date:
          </span>
          <DatePicker
            dateFormat="yyyy-MM-dd"
            selected={intvlFinal}
            onChange={date => setTimeOption('intvlFinal', date)}
            selectsEnd
            startDate={intvlStart}
            endDate={intvlFinal}
            // minDate={}
            maxDate={today}
          />
        </label>
      </div>
    </Form.Field>

  timeItems[2].content =
    <Form.Field
      id="search-by-date"
    >
      <label>
        <span className="input-label">
          Date:
        </span>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          selected={reportDate}
          onChange={date => setTimeOption('reportDate', date)}
          // minDate={}
          maxDate={today}
        />
      </label>
    </Form.Field>


  return (
    <Accordion
      preExpanded={timeSearchSel}
      onChange={expandedUUIDs =>
        setTimeOption('timeSearchSel', expandedUUIDs)}
    >
        {timeItems.map((item) => (
            <AccordionItem key={item.uuid} uuid={item.uuid}>
                <AccordionItemHeading>
                    <AccordionItemButton>
                        {item.heading}
                    </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  {item.content}
                </AccordionItemPanel>
            </AccordionItem>
        ))}
    </Accordion>
  )
}

export default TimeOptions