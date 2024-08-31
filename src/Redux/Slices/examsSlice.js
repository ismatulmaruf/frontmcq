// // features/exams/examSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const fetchExams = createAsyncThunk("exams/fetchExams", async () => {
//   const response = await fetch(`http://localhost:5000/api/v1/exam`, {
//     credentials: "include",
//   });
//   if (!response.ok) {
//     throw new Error("Failed to fetch exams");
//   }
//   const data = await response.json();
//   return data;
// });

// const examSlice = createSlice({
//   name: "exams",
//   initialState: {
//     exams: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchExams.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchExams.fulfilled, (state, action) => {
//         state.exams = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchExams.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default examSlice.reducer;
