export const login = async (req, res) => {
    try {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            role: req.user.role,
        };
        return res.status(200).send('Loged');

    } catch (err) {
        return res.status(500).json({ error: err.message });

    }
};

export const register = async (req, res) => {
    try {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            role: req.user.role,
        };

        return res.status(200).send('resgistered');

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
};

export const github = async (req, res) => {};

export const githubCallback = async (req, res) => {
	try {
		req.session.user = req.user;
		return res.redirect('/');
	} catch (err) {
		return res.status(502).json({ error: err.message });
	}
};

export const logout = async (req, res) => {
	try {
		req.session.destroy((err) => {
			if (!err) {
				return res.redirect('/');
			}

			return res.status(500).send({ status: `Logout error`, payload: err });
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};