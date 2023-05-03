export const middle1 = async (req, res, next) => {
    if (req.originalUrl !== "/auth/") {
        return next();
    }
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            return res.redirect('/auth/admin');
        } else {
            return res.redirect('/auth/protected');
        }
    } else {
        return res.redirect('/auth/login');
    }
}

export const middle2 = async (req, res, next) => {
    if (req.originalUrl !== "/auth/login") {
        return next();
    }
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            return res.redirect('/auth/admin');
        } else {
            return res.redirect('/auth/protected');
        }
    } else {
        return next();
    }
}

export const middle3 = async (req, res, next) => {
    if (req.originalUrl !== "/auth/register") {
        return next();
    }
    if (req.session.user) {
        if (req.session.user.role === "admin") {
            return res.redirect('/auth/admin');
        } else {
            return res.redirect('/auth/protected');
        }
    }
    else {
        return next();
    }
}

export const middle4 = async (req, res, next) => {
    if (req.originalUrl !== "/auth/protected") {
        return next();
    }
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    else {
        return next();
    }
}

export const middle5 = async (req, res, next) => {
    if (req.originalUrl !== "/auth/admin") {
        return next();
    }
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    if (req.session.user.role !== "admin") {
        return res.redirect('/error');
    }
    else {
        return next();
    }
}

export const middle6 = async (req, res, next) => {
    if (req.originalUrl !== "/auth/logout") {
        return next();
    }
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    else {
        return next();
    }
}

export const middle7 = async (req, res, next) => {
    console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${req.session.user ? "Authenticated User" : "Non-Authenticated User"})`);
    return next();
}

export const middle8 = async (req, res, next) => {
    if (req.originalUrl !== "/searchbars/:id") {
        return next();
    }
    if (!req.session.user && req.method==='POST') {
        return res.redirect('/error');
    } else {
        return next()
    }
}