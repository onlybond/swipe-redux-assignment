import { createSlice } from "@reduxjs/toolkit";

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: [],
  reducers: {
    addInvoice: (state, action) => {
      state.push(action.payload)
    },
    removeInvoice: (state, action) => {
      const invNum = action.payload.invoiceNumber
      return state.filter(invoice => invoice.invoiceNumber !== invNum)
    },
    updateInvoice: (state, action) => {
      const invNum = action.payload.invoiceNumber;
      const index = state.findIndex(invoice => invoice.invoiceNumber === invNum);
      if (index !== -1) {
        state[index] = action.payload.state;
      }
    },
    copyInvoice: () => { }
  }
})

export const { addInvoice, removeInvoice, updateInvoice, copyInvoice } = invoiceSlice.actions
export default invoiceSlice.reducer