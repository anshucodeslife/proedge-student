/**
 * Flutter WebView Bridge
 * Handles communication between React app and Flutter WebView
 */

class FlutterBridge {
    constructor() {
        this.isFlutter = this.detectFlutterWebView();
        this.listeners = {};
    }

    /**
     * Detect if running in Flutter WebView
     */
    detectFlutterWebView() {
        return typeof window !== 'undefined' &&
            (window.flutter_inappwebview !== undefined ||
                window.FlutterWebView !== undefined);
    }

    /**
     * Send message to Flutter
     */
    sendToFlutter(eventName, data) {
        if (!this.isFlutter) {
            console.warn('Not running in Flutter WebView');
            return;
        }

        try {
            if (window.flutter_inappwebview?.callHandler) {
                window.flutter_inappwebview.callHandler(eventName, JSON.stringify(data));
            } else if (window.FlutterWebView?.postMessage) {
                window.FlutterWebView.postMessage(JSON.stringify({ event: eventName, data }));
            }
        } catch (error) {
            console.error('Error sending message to Flutter:', error);
        }
    }

    /**
     * Listen for messages from Flutter
     */
    onMessage(eventName, callback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);
    }

    /**
     * Handle incoming message from Flutter
     */
    handleMessage(event) {
        try {
            const { event: eventName, data } = JSON.parse(event.data);
            if (this.listeners[eventName]) {
                this.listeners[eventName].forEach(callback => callback(data));
            }
        } catch (error) {
            console.error('Error handling Flutter message:', error);
        }
    }

    /**
     * Notify Flutter about navigation
     */
    notifyNavigation(route) {
        this.sendToFlutter('navigation', { route });
    }

    /**
     * Notify Flutter about authentication
     */
    notifyAuth(isAuthenticated, token = null) {
        this.sendToFlutter('auth', { isAuthenticated, token });
    }

    /**
     * Notify Flutter about logout
     */
    notifyLogout() {
        this.sendToFlutter('logout', {});
    }

    /**
     * Request token from Flutter
     */
    requestToken() {
        this.sendToFlutter('requestToken', {});
    }

    /**
     * Notify Flutter about course enrollment
     */
    notifyCourseEnrollment(courseId, courseName) {
        this.sendToFlutter('courseEnrollment', { courseId, courseName });
    }

    /**
     * Notify Flutter about payment
     */
    notifyPayment(paymentData) {
        this.sendToFlutter('payment', paymentData);
    }
}

// Create singleton instance
const flutterBridge = new FlutterBridge();

// Listen for messages from Flutter
if (typeof window !== 'undefined') {
    window.addEventListener('message', (event) => {
        flutterBridge.handleMessage(event);
    });
}

export default flutterBridge;
