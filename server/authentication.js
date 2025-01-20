require("dotenv").config()
const {User} = require("./models")
const crypto = require("node:crypto")
const exntendedError = require("./errors/ExtendedError")

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{9}$/;

const register_user = async (req, res, next) => {
    try {
    
        if (!emailRegex.test(req.body.emailPhone) && !phoneRegex.test(req.body.emailPhone)) {
          throw new exntendedError("გთხოვთ პირველ ველში შეიყვანოთ სწორი მონაცემები.", 400)
        }

        if (req.body.password.trim().length < 8) {
          throw new exntendedError("პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს", 400)
        }

        const exists = await User.findOne({
            $or: [
              { email: req.body.emailPhone },
              { phone: req.body.emailPhone }
            ]
          });

          if (exists) {
            throw new exntendedError("მომხმარებელი მეილით ან ტელეფონის ნომრით უკვე არსებობს", 400)
          }

          const salt = crypto.randomBytes(128).toString("hex")
          crypto.pbkdf2(req.body.password, salt, 600000, 128, "sha256", async (err, hashedPassword) => {
            if (err) throw new customError({message: "დაფიქსირდა გაუთვალისწინებელი შეცდომა, სცადეთ მოგვიანებით.", status: 500}).Authentication()

            const user = new User({
                ...(emailRegex.test(req.body.emailPhone) ? { email: req.body.emailPhone} : {phone: req.body.emailPhone}),
                password: hashedPassword.toString("hex"),
                salt: salt
            });

            await user.save();

            req.session.user = user._id
            res.status(200).json({success: "რეგისტრაცია წარმატებით დასრულდა"})

          })
    } catch (error) {
        next(error)
    }
}

const login_user = async (req, res, next) => {
    try {
        if (!emailRegex.test(req.body.emailPhone) && !phoneRegex.test(req.body.emailPhone)) {
          throw new exntendedError("გთხოვთ პირველ ველში შეიყვანოთ სწორი მონაცემები.", 400)
        }
  
        if (req.body.password.trim().length < 8) {
          throw new exntendedError("პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს", 400)
        }
          
        const user = await User.findOne({
            $or: [
                { email: req.body.emailPhone },
                { phone: req.body.emailPhone }
            ]
        })

        if (!user) {
            throw new exntendedError("მომხმარებელი მეილით ან ტელეფონის ნომრით არ არსებობს.", 400)
        }
        
        const hashedPassword = await new Promise((resolve, reject) => {
        crypto.pbkdf2(req.body.password, user.salt, 600000, 128, "sha256", (err, hash) => {
            if (err) {
                reject(new exntendedError("დაფიქსირდა გაუთვალისწინებელი შეცდომა, სცადეთ მოგვიანებით.", 500))
            } else {
                resolve(hash.toString("hex"));
            }
        }); 
        });

        if (user.password !== hashedPassword) {
            throw new exntendedError("პაროლი არასწორია.", 401);
        }
        
        req.session.user = user._id
        res.status(200).json({message: "წარმატებით დასრულდა"})
    } catch (error) {
        next(error)
    }
}

const isAuthenticated = (req, res, next) => {
    try {
            console.log('Session user:', req.session.user); // Debugging session access
        if(req.session.user) {
            next()
        } else {
            throw new exntendedError("მომხმარებელს არ აქვს წვდომის უფლება", 401)
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {register_user, login_user, isAuthenticated}
