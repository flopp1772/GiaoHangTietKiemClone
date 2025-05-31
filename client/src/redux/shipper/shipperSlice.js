import { createSlice } from '@reduxjs/toolkit';
import {
    fetchShipperTasks,
    fetchShipperTaskById,
    createShipperTask,
    updateShipperTask,
    deleteShipperTask
} from './shipperThunk';

const initialState = {
    tasks: [],
    selectedTask: null,
    loading: false,
    error: null,
};

const shipperSlice = createSlice({
    name: 'shipper',
    initialState,
    reducers: {
        clearSelectedTask: (state) => {
            state.selectedTask = null;
        },
        setSelectedTask: (state, action) => {
            state.selectedTask = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all tasks
            .addCase(fetchShipperTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShipperTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchShipperTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch task by id
            .addCase(fetchShipperTaskById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShipperTaskById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTask = action.payload;
            })
            .addCase(fetchShipperTaskById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create task
            .addCase(createShipperTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createShipperTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(action.payload);
            })
            .addCase(createShipperTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update task
            .addCase(updateShipperTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateShipperTask.fulfilled, (state, action) => {
                state.loading = false;
                const idx = state.tasks.findIndex(t => t.id === action.payload.id);
                if (idx !== -1) state.tasks[idx] = action.payload;
                if (state.selectedTask && state.selectedTask.id === action.payload.id) {
                    state.selectedTask = action.payload;
                }
            })
            .addCase(updateShipperTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete task
            .addCase(deleteShipperTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteShipperTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter(t => t.id !== action.payload);
                if (state.selectedTask && state.selectedTask.id === action.payload) {
                    state.selectedTask = null;
                }
            })
            .addCase(deleteShipperTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSelectedTask, setSelectedTask } = shipperSlice.actions;
export default shipperSlice.reducer;
