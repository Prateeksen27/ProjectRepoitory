import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const initializePassport = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
            try {
              
                
                const user = await User.findByEmail(email);
                if (!user) return done(null, false, { message: "No user found" });

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) return done(null, false, { message: "Incorrect password" });

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
};

export default initializePassport;
