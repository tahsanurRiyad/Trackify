import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Create a React-compatible SweetAlert instance
const MySwal = withReactContent(Swal);

/**
 * ## General Confirmation Dialog
 * Shows a confirmation dialog with default settings that can be overridden.
 * @param {object} options - Custom options to override the defaults (e.g., title, text, icon).
 * @returns {Promise<SweetAlertResult>}
 */
export const showConfirmation = (options = {}) => {
  const defaultOptions = {
    title: 'Are you sure?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  };

  return MySwal.fire({ ...defaultOptions, ...options });
};

// --- Pre-configured Alerts for Common Use Cases ---

/**
 * ## Success Alert
 * Shows a simple, auto-closing success message.
 * @param {string} title - The main message to display.
 * @param {string} [text] - Optional additional text.
 */
export const showSuccess = (title, text = '') => {
  return MySwal.fire({
    icon: 'success',
    title: title,
    text: text,
    timer: 2000, // Auto-close after 2 seconds
    showConfirmButton: false
  });
};

/**
 * ## Error Alert
 * Shows an error message that the user must acknowledge.
 * @param {string} title - The title of the error (e.g., 'Oops...').
 * @param {string} text - The error message to display.
 */
export const showError = (title = 'An Error Occurred', text) => {
  return MySwal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonColor: '#d33'
  });
};

/**
 * ## Warning Confirmation for Destructive Actions
 * A specific confirmation dialog for actions like deletion.
 * @param {object} options - Custom options, requires `text`.
 * @returns {Promise<SweetAlertResult>}
 */
export const showWarningConfirm = (options) => {
  const defaultOptions = {
    title: 'Are you absolutely sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel'
  };
  return MySwal.fire({ ...defaultOptions, ...options });
};


/**
 * ## Toast Notification
 * Shows a small, non-intrusive notification.
 * @param {string} title - The message for the toast.
 * @param {string} [icon='success'] - The icon ('success', 'error', 'warning', 'info', 'question').
 */
export const showToast = (title, icon = 'success') => {
  const Toast = MySwal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  return Toast.fire({ icon, title });
};


/**
 * ## Loading Indicator
 * Shows a loading spinner. Must be closed manually.
 * @param {string} [title='Loading...'] - The text to display below the spinner.
 */
export const showLoading = (title = 'Processing...') => {
  MySwal.fire({
    title: title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

/**
 * ## Close Loading Indicator
 * Manually closes any active SweetAlert.
 */
export const closeAlert = () => {
  MySwal.close();
};