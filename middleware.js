export const middle1 = async (req, res, next) => {
    if (req.originalUrl !== "/") {
        return next();
    }
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            return res.redirect('/admin');
        } else {
            return res.redirect('/protected');
        }
    } else {
        return res.redirect('/login');
    }
}

export const middle2 = async (req, res, next) => {
    if (req.originalUrl !== "/login") {
        return next();
    }
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            return res.redirect('/admin');
        } else {
            return res.redirect('/protected');
        }
    } else {
        return next();
    }
}

export const middle3 = async (req, res, next) => {
    if (req.originalUrl !== "/register") {
        return next();
    }
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            return res.redirect('/admin');
        } else {
            return res.redirect('/protected');
        }
    }
    else {
        return next();
    }
}

export const middle4 = async (req, res, next) => {
    if (req.originalUrl !== "/protected") {
        return next();
    }
    if (!req.session.user) {
        return res.redirect('/login');
    }
    else {
        return next();
    }
}

export const middle5 = async (req, res, next) => {
    if (req.originalUrl !== "/admin") {
        return next();
    }
    if (!req.session.user) {
        return res.redirect('/login');
    }
    if (req.session.user.role !== "admin") {
        return res.redirect('/error');
    }
    else {
        return next();
    }
}

export const middle6 = async (req, res, next) => {
    if (req.originalUrl !== "/logout") {
        return next();
    }
    if (!req.session.user) {
        return res.redirect('/login');
    }
    else {
        return next();
    }
}

export const middle7 = async (req, res, next) => {
    console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${req.session.user ? "Authenticated User" : "Non-Authenticated User"})`);
    return next();
}